import {
  async,
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick
} from '@angular/core/testing';

import {
  FormsModule,
  ReactiveFormsModule
} from '@angular/forms';

import {
  BehaviorSubject
} from 'rxjs';

import {
  SkyInputBoxModule
} from '@skyux/forms';

import {
  SkyTheme,
  SkyThemeMode,
  SkyThemeService,
  SkyThemeSettings,
  SkyThemeSettingsChange
} from '@skyux/theme';

import {
  expect,
  SkyAppTestUtility
} from '@skyux-sdk/testing';

import {
  SkyCountryFieldModule
} from './country-field.module';

import {
  CountryFieldInputBoxTestComponent
} from './fixtures/country-field-input-box.component.fixture';

import {
  CountryFieldNoFormTestComponent
} from './fixtures/country-field-no-form.component.fixture';

import {
  CountryFieldReactiveTestComponent
} from './fixtures/country-field-reactive.component.fixture';

import {
  CountryFieldTestComponent
} from './fixtures/country-field.component.fixture';

describe('Country Field Component', () => {

  //#region helpers

  function blurInput(fixture: ComponentFixture<any>): void {
    SkyAppTestUtility.fireDomEvent(getInputElement(), 'blur');
    fixture.detectChanges();
    tick();
  }

  function enterSearch(newValue: string, fixture: ComponentFixture<any>): void {
    const inputElement = getInputElement();
    inputElement.value = newValue;

    SkyAppTestUtility.fireDomEvent(inputElement, 'input');
    fixture.detectChanges();
    tick();
    fixture.detectChanges();
    tick();
  }

  function getAutocompleteElement(): HTMLElement {
    return document.querySelector('.sky-autocomplete-results') as HTMLElement;
  }

  function getInputElement(): HTMLTextAreaElement {
    return document.querySelector('textarea') as HTMLTextAreaElement;
  }

  function searchAndSelect(newValue: string, index: number, fixture: ComponentFixture<any>): void {
    const inputElement = getInputElement();

    enterSearch(newValue, fixture);
    const searchResults = getAutocompleteElement().querySelectorAll('.sky-autocomplete-result');

    // Note: the ordering of these events is important!
    SkyAppTestUtility.fireDomEvent(inputElement, 'change');
    SkyAppTestUtility.fireDomEvent(searchResults[index], 'mousedown');
    blurInput(fixture);
  }

  function searchAndGetResults(newValue: string, fixture: ComponentFixture<any>): NodeListOf<HTMLElement> {
    enterSearch(newValue, fixture);
    return getAutocompleteElement().querySelectorAll('.sky-autocomplete-result');
  }

  function validateSelectedCountry(
    nativeElement: HTMLElement,
    value: string,
    flag?: string
  ): void {
    expect(nativeElement.querySelector('textarea').value).toBe(value);

    const flagEl = nativeElement.querySelector('.sky-country-field-flag');

    if (!value) {
      expect(flagEl).toBeNull();
    }

    if (flag) {
      const flagInnerEl = flagEl.querySelector('.iti-flag');

      expect(flagInnerEl).toHaveCssClass(flag);
    }
  }

  //#endregion

  describe('template form', () => {

    let fixture: ComponentFixture<CountryFieldTestComponent>;
    let component: CountryFieldTestComponent;
    let nativeElement: HTMLElement;

    beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [
          CountryFieldTestComponent
        ],
        providers: [
          SkyThemeService
        ],
        imports: [
          FormsModule,
          SkyCountryFieldModule
        ]
      });

      fixture = TestBed.createComponent(CountryFieldTestComponent);
      nativeElement = fixture.nativeElement as HTMLElement;
      component = fixture.componentInstance;
    });

    describe('initialization', () => {

      it('should initialize with a set country', fakeAsync(() => {
        component.modelValue = {
          name: 'United States',
          iso2: 'us'
        };
        fixture.detectChanges();
        tick();
        fixture.detectChanges();

        validateSelectedCountry(nativeElement, 'United States', 'us');
      }));

      it('should initialize with a set country but only the iso2 code', fakeAsync(() => {
        component.modelValue = {
          iso2: 'us'
        };
        fixture.detectChanges();
        tick();
        fixture.detectChanges();

        validateSelectedCountry(nativeElement, 'United States', 'us');
      }));

      it('should initialize with a set country and fix an invalid name', fakeAsync(() => {
        component.modelValue = {
          iso2: 'us',
          name: 'Test Name'
        };
        fixture.detectChanges();
        tick();
        fixture.detectChanges();

        validateSelectedCountry(nativeElement, 'United States', 'us');
      }));

      it('should initialize without a set country', fakeAsync(() => {
        fixture.detectChanges();
        tick();
        fixture.detectChanges();

        validateSelectedCountry(nativeElement, '');

        expect(nativeElement.querySelector('.sky-country-field-flag')).toBeNull();
      }));

    });

    describe('usage', () => {

      it('should change countries correctly', fakeAsync(() => {
        component.modelValue = {
          name: 'United States',
          iso2: 'us'
        };
        fixture.detectChanges();
        tick();
        fixture.detectChanges();

        validateSelectedCountry(nativeElement, 'United States', 'us');

        searchAndSelect('Austr', 0, fixture);

        fixture.detectChanges();

        validateSelectedCountry(nativeElement, 'Australia', 'au');
      }));

      it('should change countries correctly via a model change', fakeAsync(() => {
        component.modelValue = {
          name: 'United States',
          iso2: 'us'
        };
        fixture.detectChanges();
        tick();
        fixture.detectChanges();

        validateSelectedCountry(nativeElement, 'United States', 'us');

        component.modelValue = {
          name: 'Australia',
          iso2: 'au'
        };

        fixture.detectChanges();
        tick();
        fixture.detectChanges();

        validateSelectedCountry(nativeElement, 'Australia', 'au');
      }));

      it('should change countries correctly via a model change with an invalid name', fakeAsync(() => {
        component.modelValue = {
          name: 'United States',
          iso2: 'us'
        };
        fixture.detectChanges();
        tick();
        fixture.detectChanges();

        validateSelectedCountry(nativeElement, 'United States', 'us');

        component.modelValue = {
          name: 'Test Name',
          iso2: 'au'
        };

        fixture.detectChanges();
        tick();
        fixture.detectChanges();

        validateSelectedCountry(nativeElement, 'Australia', 'au');
      }));

      it('should change countries correctly via a model change with only a iso2 code', fakeAsync(() => {
        component.modelValue = {
          name: 'United States',
          iso2: 'us'
        };
        fixture.detectChanges();
        tick();
        fixture.detectChanges();

        validateSelectedCountry(nativeElement, 'United States', 'us');

        component.modelValue = {
          name: 'Australia',
          iso2: 'au'
        };

        fixture.detectChanges();
        tick();
        fixture.detectChanges();

        validateSelectedCountry(nativeElement, 'Australia', 'au');
      }));

      it('should display the default country first in the result list with not selection', fakeAsync(() => {
        component.defaultCountry = 'cy';
        fixture.detectChanges();
        tick();
        fixture.detectChanges();

        const results = searchAndGetResults('us', fixture);

        expect(results[0].innerText.trim()).toBe('Cyprus (Κύπρος)');
        expect(results[0].querySelector('div')).toHaveCssClass('iti-flag');
        expect(results[0].querySelector('div')).toHaveCssClass('cy');
      }));

      it('should only display supported countries', fakeAsync(() => {
        component.defaultCountry = 'us';
        component.supportedCountryISOs = ['au', 'us'];
        fixture.detectChanges();
        tick();
        fixture.detectChanges();

        const results = searchAndGetResults('us', fixture);

        expect(results[0].innerText.trim()).toBe('United States');
        expect(results[0].querySelector('div')).toHaveCssClass('iti-flag');
        expect(results[0].querySelector('div')).toHaveCssClass('us');

        expect(results[1].innerText.trim()).toBe('Australia');
        expect(results[1].querySelector('div')).toHaveCssClass('iti-flag');
        expect(results[1].querySelector('div')).toHaveCssClass('au');

        expect(results.length).toBe(2);
      }));

      it('should display the default country second in the result list with a selection', fakeAsync(() => {
        component.modelValue = {
          name: 'United States',
          iso2: 'us'
        };
        component.defaultCountry = 'cy';
        fixture.detectChanges();
        tick();
        fixture.detectChanges();

        const results = searchAndGetResults('us', fixture);

        expect(results[0].innerText.trim()).toBe('United States');
        expect(results[0].querySelector('div')).toHaveCssClass('iti-flag');
        expect(results[0].querySelector('div')).toHaveCssClass('us');
        expect(results[1].innerText.trim()).toBe('Cyprus (Κύπρος)');
        expect(results[1].querySelector('div')).toHaveCssClass('iti-flag');
        expect(results[1].querySelector('div')).toHaveCssClass('cy');
      }));

      it('should clear the selection when all search text is cleared', fakeAsync(() => {
        component.modelValue = {
          name: 'United States',
          iso2: 'us'
        };
        fixture.detectChanges();
        tick();
        fixture.detectChanges();

        enterSearch('', fixture);
        blurInput(fixture);

        fixture.detectChanges();
        tick();
        fixture.detectChanges();

        expect(component.modelValue).toBeUndefined();
        validateSelectedCountry(nativeElement, '');
      }));

      it('should set autocomplete defaults', () => {
        fixture.detectChanges();

        const textAreaElement = getInputElement();

        expect(textAreaElement.getAttribute('autocomplete')).toEqual('off');
      });

      it('should update autocomplete value', fakeAsync(() => {
        component.autocompleteAttribute = 'new-custom-field';
        fixture.detectChanges();

        const textAreaElement = getInputElement();

        expect(textAreaElement.getAttribute('autocomplete')).toEqual('new-custom-field');
      }));

      it('should disable the field correctly', fakeAsync(() => {
        component.modelValue = {
          name: 'United States',
          iso2: 'us'
        };
        component.isDisabled = true;
        expect(component.countryFieldComponent.isInputFocused).toBeFalsy();
        fixture.detectChanges();
        tick();

        const textAreaElement: HTMLElement = nativeElement.querySelector('textarea');

        expect(textAreaElement
          .attributes.getNamedItem('disabled')).not.toBeNull();
        SkyAppTestUtility.fireDomEvent(textAreaElement, 'mousedown');
        SkyAppTestUtility.fireDomEvent(textAreaElement, 'focusin');
        fixture.detectChanges();
        tick();

        expect(component.countryFieldComponent.isInputFocused).toBeFalsy();
      }));

      it('should enable the field correctly', fakeAsync(() => {
        component.modelValue = {
          name: 'United States',
          iso2: 'us'
        };
        component.isDisabled = true;
        fixture.detectChanges();
        tick();

        const textAreaElement: HTMLElement = nativeElement.querySelector('textarea');

        expect((<HTMLElement>nativeElement.querySelector('textarea'))
          .attributes.getNamedItem('disabled')).not.toBeNull();
        component.isDisabled = false;
        fixture.detectChanges();
        tick();

        SkyAppTestUtility.fireDomEvent(textAreaElement, 'mousedown');
        fixture.detectChanges();
        tick();

        expect((<HTMLElement>nativeElement.querySelector('textarea'))
          .attributes.getNamedItem('disabled')).toBeNull();
        expect(component.countryFieldComponent.isInputFocused).toBeTruthy();

        component.countryFieldComponent.isInputFocused = false;
        expect(component.countryFieldComponent.isInputFocused).toBeFalsy();
        SkyAppTestUtility.fireDomEvent(textAreaElement, 'focusin');
        fixture.detectChanges();

        expect(component.countryFieldComponent.isInputFocused).toBeTruthy();
      }));

      it('should emit the countryChange event correctly', fakeAsync(() => {
        let changeEventSpy = spyOn(component, 'countryChanged').and.callThrough();
        component.modelValue = {
          name: 'United States',
          iso2: 'us'
        };
        fixture.detectChanges();
        tick();
        fixture.detectChanges();

        expect(changeEventSpy).not.toHaveBeenCalled();
        searchAndSelect('Austr', 0, fixture);
        fixture.detectChanges();
        tick();
        fixture.detectChanges();
        expect(changeEventSpy).toHaveBeenCalledWith({
          name: 'Australia',
          iso2: 'au'
        });

        changeEventSpy.calls.reset();

        component.modelValue = {
          name: 'Australia',
          iso2: 'au'
        };
        fixture.detectChanges();
        tick();
        fixture.detectChanges();
        expect(changeEventSpy).not.toHaveBeenCalled();
      }));

      it('should not include dial code information when the `includePhoneInfo` input is not set', fakeAsync(() => {
        let changeEventSpy = spyOn(component, 'countryChanged').and.callThrough();
        component.countryFieldComponent.includePhoneInfo = false;
        component.modelValue = {
          name: 'United States',
          iso2: 'us'
        };
        fixture.detectChanges();
        tick();
        fixture.detectChanges();

        expect(changeEventSpy).not.toHaveBeenCalled();
        searchAndSelect('Austr', 0, fixture);
        fixture.detectChanges();
        tick();
        expect(changeEventSpy).toHaveBeenCalledWith({
          name: 'Australia',
          iso2: 'au'
        });

        const searchResults = searchAndGetResults('Austr', fixture);
        expect(searchResults[0].querySelector('.sky-deemphasized')).toBeNull();
      }));

      it('should include dial code information when the `includePhoneInfo` input is set', fakeAsync(() => {
        let changeEventSpy = spyOn(component, 'countryChanged').and.callThrough();
        component.countryFieldComponent.includePhoneInfo = true;
        component.modelValue = {
          name: 'United States',
          iso2: 'us'
        };
        fixture.detectChanges();
        tick();
        fixture.detectChanges();

        expect(changeEventSpy).not.toHaveBeenCalled();
        searchAndSelect('Austr', 0, fixture);
        fixture.detectChanges();
        tick();
        expect(changeEventSpy).toHaveBeenCalledWith({
          name: 'Australia',
          iso2: 'au',
          dialCode: '61',
          priority: 0,
          // Disabling null linting here as the library that sets this uses null here.
          // tslint:disable-next-line: no-null-keyword
          areaCodes: null
        });

        const searchResults = searchAndGetResults('Austr', fixture);
        expect(searchResults[0].querySelector('.sky-deemphasized').textContent.trim()).toBe('61');
      }));

      it('should not hide the flag in the input box if the `hideSelectedCountryFlag` is not set', fakeAsync(() => {
        component.countryFieldComponent.hideSelectedCountryFlag = false;
        component.modelValue = {
          name: 'United States',
          iso2: 'us'
        };
        fixture.detectChanges();
        tick();
        fixture.detectChanges();

        expect(nativeElement.querySelector('.sky-country-field-flag')).not.toBeNull();
      }));

      it('should hide the flag in the input box if the `hideSelectedCountryFlag` is set', fakeAsync(() => {
        component.countryFieldComponent.hideSelectedCountryFlag = true;
        component.modelValue = {
          name: 'United States',
          iso2: 'us'
        };
        fixture.detectChanges();
        tick();
        fixture.detectChanges();

        expect(nativeElement.querySelector('.sky-country-field-flag')).toBeNull();
      }));

    });

    describe('validation', () => {

      it('should mark the form invalid when it is empty and required', fakeAsync(() => {
        fixture.detectChanges();
        component.isRequired = true;
        fixture.detectChanges();
        tick();
        component.ngModel.control.updateValueAndValidity();
        fixture.detectChanges();
        tick();
        fixture.detectChanges();

        expect(component.ngModel.valid).toEqual(false);
      }));

      it('should mark the form valid when it is set and required', fakeAsync(() => {
        component.modelValue = {
          name: 'United States',
          iso2: 'us'
        };
        fixture.detectChanges();
        component.isRequired = true;
        fixture.detectChanges();
        tick();
        component.ngModel.control.updateValueAndValidity();
        fixture.detectChanges();
        tick();
        fixture.detectChanges();

        expect(component.ngModel.valid).toEqual(true);
      }));

      it('should mark the form invalid when it is set to a non-real country', fakeAsync(() => {
        component.modelValue = {
          name: 'Test Country',
          iso2: 'xx'
        };
        fixture.detectChanges();
        component.ngModel.control.updateValueAndValidity();
        fixture.detectChanges();
        tick();
        fixture.detectChanges();

        expect(component.ngModel.valid).toEqual(false);
      }));

      it('should mark the form valid when it is set to a real country', fakeAsync(() => {
        component.modelValue = {
          name: 'United States',
          iso2: 'us'
        };
        fixture.detectChanges();
        component.ngModel.control.updateValueAndValidity();
        fixture.detectChanges();
        tick();
        fixture.detectChanges();

        expect(component.ngModel.valid).toEqual(true);
      }));

      it('should mark the form valid when it is set to a supported country', fakeAsync(() => {
        component.modelValue = {
          name: 'Australia',
          iso2: 'au'
        };
        component.supportedCountryISOs = ['au', 'de'];
        fixture.detectChanges();
        component.ngModel.control.updateValueAndValidity();
        fixture.detectChanges();
        tick();
        fixture.detectChanges();

        expect(component.ngModel.valid).toEqual(true);
      }));

      it('should mark the form invalid when it is set to a non-supported country', fakeAsync(() => {
        component.modelValue = {
          name: 'United States',
          iso2: 'us'
        };
        component.supportedCountryISOs = ['au', 'de'];
        fixture.detectChanges();
        component.ngModel.control.updateValueAndValidity();
        fixture.detectChanges();
        tick();
        fixture.detectChanges();

        expect(component.ngModel.valid).toEqual(false);
      }));

    });

    describe('a11y', () => {

      const axeConfig = {
        rules: {
          'region': {
            enabled: false
          }
        }
      };

      it('should be accessible (empty)', async(() => {
        fixture.detectChanges();
        fixture.whenStable().then(() => {
          fixture.detectChanges();
          expect(document.body).toBeAccessible(() => {}, axeConfig);
        });
      }));

      it('should be accessible (populated)', async(() => {
        component.modelValue = {
          name: 'United States',
          iso2: 'us'
        };
        fixture.detectChanges();
        fixture.whenStable().then(() => {
          fixture.detectChanges();
          expect(document.body).toBeAccessible(() => {}, axeConfig);
        });
      }));

    });

  });

  describe('reactive form', () => {

    let fixture: ComponentFixture<CountryFieldReactiveTestComponent>;
    let component: CountryFieldReactiveTestComponent;
    let nativeElement: HTMLElement;

    beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [
          CountryFieldReactiveTestComponent
        ],
        providers: [
          SkyThemeService
        ],
        imports: [
          ReactiveFormsModule,
          SkyCountryFieldModule
        ]
      });

      fixture = TestBed.createComponent(CountryFieldReactiveTestComponent);
      nativeElement = fixture.nativeElement as HTMLElement;
      component = fixture.componentInstance;
    });

    describe('initialization', () => {

      it('should initialize with a set country', fakeAsync(() => {
        component.initialValue = {
          name: 'United States',
          iso2: 'us'
        };
        fixture.detectChanges();
        tick();
        fixture.detectChanges();

        validateSelectedCountry(nativeElement, 'United States', 'us');
      }));

      it('should initialize with a set country but only the iso2 code', fakeAsync(() => {
        component.initialValue = {
          iso2: 'us'
        };
        fixture.detectChanges();
        tick();
        fixture.detectChanges();

        validateSelectedCountry(nativeElement, 'United States', 'us');
      }));

      it('should initialize with a set country and fix an invalid name', fakeAsync(() => {
        component.initialValue = {
          iso2: 'us',
          name: 'Test Name'
        };
        fixture.detectChanges();
        tick();
        fixture.detectChanges();

        validateSelectedCountry(nativeElement, 'United States', 'us');
      }));

      it('should initialize without a set country', fakeAsync(() => {
        fixture.detectChanges();
        tick();
        fixture.detectChanges();

        expect(nativeElement.querySelector('textarea').value).toBe('');
        expect(nativeElement.querySelector('.sky-country-field-flag')).toBeNull();
      }));

    });

    describe('usage', () => {

      it('should change countries correctly', fakeAsync(() => {
        component.initialValue = {
          name: 'United States',
          iso2: 'us'
        };
        fixture.detectChanges();
        tick();
        fixture.detectChanges();

        validateSelectedCountry(nativeElement, 'United States', 'us');

        searchAndSelect('Austr', 0, fixture);

        fixture.detectChanges();

        validateSelectedCountry(nativeElement, 'Australia', 'au');
      }));

      it('should change countries correctly via a model change', fakeAsync(() => {
        component.initialValue = {
          name: 'United States',
          iso2: 'us'
        };
        fixture.detectChanges();
        tick();
        fixture.detectChanges();

        validateSelectedCountry(nativeElement, 'United States', 'us');

        component.countryControl.setValue({
          name: 'Australia',
          iso2: 'au'
        });

        fixture.detectChanges();
        tick();
        fixture.detectChanges();

        validateSelectedCountry(nativeElement, 'Australia', 'au');
      }));

      it('should change countries correctly via a model change with an invalid name', fakeAsync(() => {
        component.initialValue = {
          name: 'United States',
          iso2: 'us'
        };
        fixture.detectChanges();
        tick();
        fixture.detectChanges();

        validateSelectedCountry(nativeElement, 'United States', 'us');

        component.countryControl.setValue({
          name: 'Test Name',
          iso2: 'au'
        });

        fixture.detectChanges();
        tick();
        fixture.detectChanges();

        validateSelectedCountry(nativeElement, 'Australia', 'au');
      }));

      it('should change countries correctly via a model change with only a iso2 code', fakeAsync(() => {
        component.initialValue = {
          name: 'United States',
          iso2: 'us'
        };
        fixture.detectChanges();
        tick();
        fixture.detectChanges();

        validateSelectedCountry(nativeElement, 'United States', 'us');

        component.countryControl.setValue({
          name: 'Australia',
          iso2: 'au'
        });

        fixture.detectChanges();
        tick();
        fixture.detectChanges();

        validateSelectedCountry(nativeElement, 'Australia', 'au');
      }));

      it('should display the default country first in the result list with not selection', fakeAsync(() => {
        component.defaultCountry = 'cy';
        fixture.detectChanges();
        tick();
        fixture.detectChanges();

        const results = searchAndGetResults('us', fixture);

        expect(results[0].innerText.trim()).toBe('Cyprus (Κύπρος)');
        expect(results[0].querySelector('div')).toHaveCssClass('iti-flag');
        expect(results[0].querySelector('div')).toHaveCssClass('cy');
      }));

      it('should only display supported countries', fakeAsync(() => {
        component.defaultCountry = 'us';
        component.supportedCountryISOs = ['au', 'us'];
        fixture.detectChanges();
        tick();
        fixture.detectChanges();

        const results = searchAndGetResults('us', fixture);

        expect(results[0].innerText.trim()).toBe('United States');
        expect(results[0].querySelector('div')).toHaveCssClass('iti-flag');
        expect(results[0].querySelector('div')).toHaveCssClass('us');

        expect(results[1].innerText.trim()).toBe('Australia');
        expect(results[1].querySelector('div')).toHaveCssClass('iti-flag');
        expect(results[1].querySelector('div')).toHaveCssClass('au');

        expect(results.length).toBe(2);
      }));

      it('should handle ISOs in mixed case', fakeAsync(() => {
        component.defaultCountry = 'us';
        component.supportedCountryISOs = ['au', 'US'];
        fixture.detectChanges();
        tick();
        fixture.detectChanges();

        let results = searchAndGetResults('us', fixture);

        expect(results[0].innerText.trim()).toBe('United States');
        expect(results[0].querySelector('div')).toHaveCssClass('iti-flag');
        expect(results[0].querySelector('div')).toHaveCssClass('us');

        expect(results[1].innerText.trim()).toBe('Australia');
        expect(results[1].querySelector('div')).toHaveCssClass('iti-flag');
        expect(results[1].querySelector('div')).toHaveCssClass('au');

        expect(results.length).toBe(2);
      }));

      it('should handle reverting supported countries back to the defaults', fakeAsync(() => {
        component.defaultCountry = 'us';
        component.supportedCountryISOs = ['au', 'gb', 'us'];
        fixture.detectChanges();
        tick();
        fixture.detectChanges();

        expect(component.countryFieldComponent.countries.length).toBe(
          3,
          'Expected total number of countries to be "3".'
        );

        component.supportedCountryISOs = undefined;
        fixture.detectChanges();
        tick();
        fixture.detectChanges();

        expect(component.countryFieldComponent.countries.length).toBeGreaterThan(
          2,
          'Expected total number of countries to be greater than 2.'
        );
      }));

      it('should display the default country second in the result list with a selection', fakeAsync(() => {
        component.initialValue = {
          name: 'United States',
          iso2: 'us'
        };
        component.defaultCountry = 'cy';
        fixture.detectChanges();
        tick();
        fixture.detectChanges();

        const results = searchAndGetResults('us', fixture);

        expect(results[0].innerText.trim()).toBe('United States');
        expect(results[0].querySelector('div')).toHaveCssClass('iti-flag');
        expect(results[0].querySelector('div')).toHaveCssClass('us');
        expect(results[1].innerText.trim()).toBe('Cyprus (Κύπρος)');
        expect(results[1].querySelector('div')).toHaveCssClass('iti-flag');
        expect(results[1].querySelector('div')).toHaveCssClass('cy');
      }));

      it('should clear the selection when all search text is cleared', fakeAsync(() => {
        component.initialValue = {
          name: 'United States',
          iso2: 'us'
        };
        fixture.detectChanges();
        tick();
        fixture.detectChanges();

        enterSearch('', fixture);
        blurInput(fixture);

        fixture.detectChanges();
        tick();
        fixture.detectChanges();

        expect(component.countryControl.value).toBeUndefined();
        expect(nativeElement.querySelector('textarea').value).toBe('');
        expect(nativeElement.querySelector('.sky-country-field-flag')).toBeNull();
      }));

      it('should disable the field correctly', fakeAsync(() => {
        component.initialValue = {
          name: 'United States',
          iso2: 'us'
        };
        fixture.detectChanges();
        tick();
        component.isDisabled = true;
        expect(component.countryFieldComponent.isInputFocused).toBeFalsy();
        fixture.detectChanges();
        tick();

        const textAreaElement: HTMLElement = nativeElement.querySelector('textarea');

        expect(component.countryFieldComponent.disabled).toBeTruthy();
        SkyAppTestUtility.fireDomEvent(textAreaElement, 'mousedown');
        SkyAppTestUtility.fireDomEvent(textAreaElement, 'focusin');
        fixture.detectChanges();
        tick();

        expect(component.countryFieldComponent.isInputFocused).toBeFalsy();
      }));

      it('should enable the field correctly', fakeAsync(() => {
        component.initialValue = {
          name: 'United States',
          iso2: 'us'
        };
        fixture.detectChanges();
        tick();
        component.isDisabled = true;
        fixture.detectChanges();
        tick();

        const textAreaElement: HTMLElement = nativeElement.querySelector('textarea');

        expect(component.countryFieldComponent.disabled).toBeTruthy();
        component.isDisabled = false;
        fixture.detectChanges();
        tick();

        SkyAppTestUtility.fireDomEvent(textAreaElement, 'mousedown');
        fixture.detectChanges();
        tick();

        expect(component.countryFieldComponent.disabled).toBeFalsy();
        expect(component.countryFieldComponent.isInputFocused).toBeTruthy();

        component.countryFieldComponent.isInputFocused = false;
        expect(component.countryFieldComponent.isInputFocused).toBeFalsy();
        SkyAppTestUtility.fireDomEvent(textAreaElement, 'focusin');
        fixture.detectChanges();

        expect(component.countryFieldComponent.isInputFocused).toBeTruthy();
      }));

      it('should mark the form as touched when the form loses focus', fakeAsync(() => {
        fixture.detectChanges();
        const textAreaElement = getInputElement();
        expect(component.countryForm.touched).toEqual(false);

        SkyAppTestUtility.fireDomEvent(textAreaElement, 'blur');
        tick();
        fixture.detectChanges();

        expect(component.countryForm.touched).toEqual(true);
      }));

      it('should emit the countryChange event correctly', fakeAsync(() => {
        let changeEventSpy = spyOn(component, 'countryChanged').and.callThrough();
        component.initialValue = {
          name: 'United States',
          iso2: 'us'
        };
        fixture.detectChanges();
        tick();
        fixture.detectChanges();

        expect(changeEventSpy).not.toHaveBeenCalled();
        searchAndSelect('Austr', 0, fixture);
        fixture.detectChanges();
        tick();
        fixture.detectChanges();
        expect(changeEventSpy).toHaveBeenCalledWith({
          name: 'Australia',
          iso2: 'au'
        });

        changeEventSpy.calls.reset();

        component.setValue({
          name: 'Australia',
          iso2: 'au'
        });
        fixture.detectChanges();
        tick();
        fixture.detectChanges();
        expect(changeEventSpy).not.toHaveBeenCalled();
      }));

      it('should emit the valueChange form control event correctly with an initial value', fakeAsync(() => {
        let changeEventSpy = spyOn(component, 'formValueChanged').and.callThrough();
        component.initialValue = {
          name: 'United States',
          iso2: 'us'
        };
        fixture.detectChanges();
        tick();

        expect(changeEventSpy).not.toHaveBeenCalled();
        searchAndSelect('Austr', 0, fixture);
        fixture.detectChanges();
        tick();
        expect(changeEventSpy).toHaveBeenCalledWith({
          name: 'Australia',
          iso2: 'au'
        });
      }));

      it('should emit the valueChange form control event correctly when no initial value', fakeAsync(() => {
        let changeEventSpy = spyOn(component, 'formValueChanged').and.callThrough();
        fixture.detectChanges();
        tick();

        expect(changeEventSpy).not.toHaveBeenCalled();
        searchAndSelect('Austr', 0, fixture);
        fixture.detectChanges();
        tick();
        expect(changeEventSpy).toHaveBeenCalledWith({
          name: 'Australia',
          iso2: 'au'
        });
      }));

      it('should emit the valueChange form control event correctly when initialized to undefined', fakeAsync(() => {
        let changeEventSpy = spyOn(component, 'formValueChanged').and.callThrough();
        component.initiallizeToUndefined = true;
        fixture.detectChanges();
        tick();

        expect(changeEventSpy).not.toHaveBeenCalled();
        searchAndSelect('Austr', 0, fixture);
        fixture.detectChanges();
        tick();
        expect(changeEventSpy).toHaveBeenCalledWith({
          name: 'Australia',
          iso2: 'au'
        });
      }));

      it('should not include dial code information when the `includePhoneInfo` input is not set', fakeAsync(() => {
        let changeEventSpy = spyOn(component, 'formValueChanged').and.callThrough();
        component.countryFieldComponent.includePhoneInfo = false;
        component.initialValue = {
          name: 'United States',
          iso2: 'us'
        };
        fixture.detectChanges();
        tick();

        expect(changeEventSpy).not.toHaveBeenCalled();
        searchAndSelect('Austr', 0, fixture);
        fixture.detectChanges();
        tick();
        expect(changeEventSpy).toHaveBeenCalledWith({
          name: 'Australia',
          iso2: 'au'
        });

        const searchResults = searchAndGetResults('Austr', fixture);
        expect(searchResults[0].querySelector('.sky-deemphasized')).toBeNull();
      }));

      it('should include dial code information when the `includePhoneInfo` input is set', fakeAsync(() => {
        let changeEventSpy = spyOn(component, 'formValueChanged').and.callThrough();
        component.countryFieldComponent.includePhoneInfo = true;
        component.initialValue = {
          name: 'United States',
          iso2: 'us'
        };
        fixture.detectChanges();
        tick();

        expect(changeEventSpy).not.toHaveBeenCalled();
        searchAndSelect('Austr', 0, fixture);
        fixture.detectChanges();
        tick();
        expect(changeEventSpy).toHaveBeenCalledWith({
          name: 'Australia',
          iso2: 'au',
          dialCode: '61',
          priority: 0,
          // Disabling null linting here as the library that sets this uses null here.
          // tslint:disable-next-line: no-null-keyword
          areaCodes: null
        });

        const searchResults = searchAndGetResults('Austr', fixture);
        expect(searchResults[0].querySelector('.sky-deemphasized').textContent.trim()).toBe('61');
      }));

      it('should not hide the flag in the input box if the `hideSelectedCountryFlag` is not set', fakeAsync(() => {
        component.countryFieldComponent.hideSelectedCountryFlag = false;
        component.initialValue = {
          name: 'United States',
          iso2: 'us'
        };
        fixture.detectChanges();
        tick();

        expect(nativeElement.querySelector('.sky-country-field-flag')).not.toBeNull();
      }));

      it('should hide the flag in the input box if the `hideSelectedCountryFlag` is set', fakeAsync(() => {
        component.countryFieldComponent.hideSelectedCountryFlag = true;
        component.initialValue = {
          name: 'United States',
          iso2: 'us'
        };
        fixture.detectChanges();
        tick();

        expect(nativeElement.querySelector('.sky-country-field-flag')).toBeNull();
      }));

    });

    describe('validation', () => {

      it('should mark the form invalid when it is empty and required', fakeAsync(() => {
        fixture.detectChanges();
        component.isRequired = true;
        fixture.detectChanges();
        tick();
        component.countryControl.updateValueAndValidity();
        fixture.detectChanges();
        tick();
        fixture.detectChanges();

        expect(component.countryForm.valid).toEqual(false);
      }));

      it('should mark the form valid when it is set and required', fakeAsync(() => {
        component.initialValue = {
          name: 'United States',
          iso2: 'us'
        };
        fixture.detectChanges();
        component.isRequired = true;
        fixture.detectChanges();
        tick();
        component.countryControl.updateValueAndValidity();
        fixture.detectChanges();
        tick();
        fixture.detectChanges();

        expect(component.countryForm.valid).toEqual(true);
      }));

      it('should mark the form invalid when it is set to a non-real country', fakeAsync(() => {
        component.initialValue = {
          name: 'Test Country',
          iso2: 'xx'
        };
        fixture.detectChanges();
        component.countryControl.updateValueAndValidity();
        fixture.detectChanges();
        tick();
        fixture.detectChanges();

        expect(component.countryForm.valid).toEqual(false);
      }));

      it('should mark the form valid when it is set to a real country', fakeAsync(() => {
        component.initialValue = {
          name: 'United States',
          iso2: 'us'
        };
        fixture.detectChanges();
        component.countryControl.updateValueAndValidity();
        fixture.detectChanges();
        tick();
        fixture.detectChanges();

        expect(component.countryForm.valid).toEqual(true);
      }));

      it('should mark the form valid when it is set to a supported country', fakeAsync(() => {
        component.initialValue = {
          name: 'Australia',
          iso2: 'au'
        };
        component.supportedCountryISOs = ['au', 'de'];
        fixture.detectChanges();
        component.countryControl.updateValueAndValidity();
        fixture.detectChanges();
        tick();
        fixture.detectChanges();

        expect(component.countryForm.valid).toEqual(true);
      }));

      it('should mark the form invalid when it is set to a non-supported country', fakeAsync(() => {
        component.initialValue = {
          name: 'United States',
          iso2: 'us'
        };
        component.supportedCountryISOs = ['au', 'de'];
        fixture.detectChanges();
        component.countryControl.updateValueAndValidity();
        fixture.detectChanges();
        tick();
        fixture.detectChanges();

        expect(component.countryForm.valid).toEqual(false);
      }));

    });

    describe('a11y', () => {

      const axeConfig = {
        rules: {
          'region': {
            enabled: false
          }
        }
      };

      it('should be accessible (empty)', async(() => {
        fixture.detectChanges();
        fixture.whenStable().then(() => {
          fixture.detectChanges();
          expect(document.body).toBeAccessible(() => {}, axeConfig);
        });
      }));

      it('should be accessible (populated)', async(() => {
        component.initialValue = {
          name: 'United States',
          iso2: 'us'
        };
        fixture.detectChanges();
        fixture.whenStable().then(() => {
          fixture.detectChanges();
          expect(document.body).toBeAccessible(() => {}, axeConfig);
        });
      }));

    });

  });

  describe('no form', () => {

    let fixture: ComponentFixture<CountryFieldNoFormTestComponent>;
    let component: CountryFieldNoFormTestComponent;
    let nativeElement: HTMLElement;

    beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [
          CountryFieldNoFormTestComponent
        ],
        providers: [
          SkyThemeService
        ],
        imports: [
          SkyCountryFieldModule
        ]
      });

      fixture = TestBed.createComponent(CountryFieldNoFormTestComponent);
      nativeElement = fixture.nativeElement as HTMLElement;
      component = fixture.componentInstance;
    });

    describe('usage', () => {

      it('should change countries correctly', fakeAsync(() => {
        fixture.detectChanges();
        tick();
        fixture.detectChanges();
        expect(nativeElement.querySelector('textarea').value).toBe('');

        searchAndSelect('Austr', 0, fixture);

        fixture.detectChanges();

        validateSelectedCountry(nativeElement, 'Australia', 'au');
      }));

      it('should display the default country first in the result list with not selection', fakeAsync(() => {
        component.defaultCountry = 'cy';
        fixture.detectChanges();
        tick();
        fixture.detectChanges();

        const results = searchAndGetResults('us', fixture);

        expect(results[0].innerText.trim()).toBe('Cyprus (Κύπρος)');
        expect(results[0].querySelector('div')).toHaveCssClass('iti-flag');
        expect(results[0].querySelector('div')).toHaveCssClass('cy');
      }));

      it('should only display supported countries', fakeAsync(() => {
        component.defaultCountry = 'us';
        component.supportedCountryISOs = ['au', 'us'];
        fixture.detectChanges();
        tick();
        fixture.detectChanges();

        const results = searchAndGetResults('us', fixture);

        expect(results[0].innerText.trim()).toBe('United States');
        expect(results[0].querySelector('div')).toHaveCssClass('iti-flag');
        expect(results[0].querySelector('div')).toHaveCssClass('us');

        expect(results[1].innerText.trim()).toBe('Australia');
        expect(results[1].querySelector('div')).toHaveCssClass('iti-flag');
        expect(results[1].querySelector('div')).toHaveCssClass('au');

        expect(results.length).toBe(2);
      }));

      it('should display the default country second in the result list with a selection', fakeAsync(() => {
        component.defaultCountry = 'cy';
        fixture.detectChanges();
        tick();
        fixture.detectChanges();

        searchAndSelect('Austr', 0, fixture);

        fixture.detectChanges();
        tick();
        fixture.detectChanges();

        const results = searchAndGetResults('us', fixture);

        expect(results[0].innerText.trim()).toBe('Australia');
        expect(results[0].querySelector('div')).toHaveCssClass('iti-flag');
        expect(results[0].querySelector('div')).toHaveCssClass('au');
        expect(results[1].innerText.trim()).toBe('Cyprus (Κύπρος)');
        expect(results[1].querySelector('div')).toHaveCssClass('iti-flag');
        expect(results[1].querySelector('div')).toHaveCssClass('cy');
      }));

      it('should clear the selection when all search text is cleared', fakeAsync(() => {
        fixture.detectChanges();
        tick();
        fixture.detectChanges();

        searchAndSelect('Austr', 0, fixture);

        fixture.detectChanges();
        tick();
        fixture.detectChanges();

        enterSearch('', fixture);
        blurInput(fixture);

        fixture.detectChanges();
        tick();
        fixture.detectChanges();

        expect(nativeElement.querySelector('textarea').value).toBe('');
        expect(nativeElement.querySelector('.sky-country-field-flag')).toBeNull();
      }));

      it('should disable the field correctly', fakeAsync(() => {
        fixture.detectChanges();
        tick();
        component.isDisabled = true;
        expect(component.countryFieldComponent.isInputFocused).toBeFalsy();
        fixture.detectChanges();
        tick();
        fixture.detectChanges();
        tick();

        const textAreaElement: HTMLElement = nativeElement.querySelector('textarea');

        expect(component.countryFieldComponent.disabled).toBeTruthy();
        SkyAppTestUtility.fireDomEvent(textAreaElement, 'mousedown');
        SkyAppTestUtility.fireDomEvent(textAreaElement, 'focusin');
        fixture.detectChanges();
        tick();

        expect(component.countryFieldComponent.isInputFocused).toBeFalsy();
      }));

      it('should enable the field correctly', fakeAsync(() => {
        fixture.detectChanges();
        tick();
        component.isDisabled = true;
        fixture.detectChanges();
        tick();

        const textAreaElement: HTMLElement = nativeElement.querySelector('textarea');

        expect(component.countryFieldComponent.disabled).toBeTruthy();
        component.isDisabled = false;
        fixture.detectChanges();
        tick();

        SkyAppTestUtility.fireDomEvent(textAreaElement, 'mousedown');
        fixture.detectChanges();
        tick();

        expect(component.countryFieldComponent.disabled).toBeFalsy();
        expect(component.countryFieldComponent.isInputFocused).toBeTruthy();

        component.countryFieldComponent.isInputFocused = false;
        expect(component.countryFieldComponent.isInputFocused).toBeFalsy();
        SkyAppTestUtility.fireDomEvent(textAreaElement, 'focusin');
        fixture.detectChanges();

        expect(component.countryFieldComponent.isInputFocused).toBeTruthy();
      }));

      it('should emit the countryChange event correctly', fakeAsync(() => {
        let changeEventSpy = spyOn(component, 'countryChanged').and.callThrough();
        fixture.detectChanges();
        tick();

        expect(changeEventSpy).not.toHaveBeenCalled();
        searchAndSelect('Austr', 0, fixture);
        fixture.detectChanges();
        tick();
        expect(changeEventSpy).toHaveBeenCalledWith({
          name: 'Australia',
          iso2: 'au'
        });
      }));

      it('should not include dial code information when the `includePhoneInfo` input is not set', fakeAsync(() => {
        let changeEventSpy = spyOn(component, 'countryChanged').and.callThrough();
        component.countryFieldComponent.includePhoneInfo = false;
        fixture.detectChanges();
        tick();
        fixture.detectChanges();

        searchAndSelect('Austr', 0, fixture);
        fixture.detectChanges();
        tick();
        expect(changeEventSpy).toHaveBeenCalledWith({
          name: 'Australia',
          iso2: 'au'
        });

        const searchResults = searchAndGetResults('Austr', fixture);
        expect(searchResults[0].querySelector('.sky-deemphasized')).toBeNull();
      }));

      it('should include dial code information when the `includePhoneInfo` input is set', fakeAsync(() => {
        let changeEventSpy = spyOn(component, 'countryChanged').and.callThrough();
        component.countryFieldComponent.includePhoneInfo = true;
        fixture.detectChanges();
        tick();
        fixture.detectChanges();

        searchAndSelect('Austr', 0, fixture);
        fixture.detectChanges();
        tick();
        expect(changeEventSpy).toHaveBeenCalledWith({
          name: 'Australia',
          iso2: 'au',
          dialCode: '61',
          priority: 0,
          // Disabling null linting here as the library that sets this uses null here.
          // tslint:disable-next-line: no-null-keyword
          areaCodes: null
        });

        const searchResults = searchAndGetResults('Austr', fixture);
        expect(searchResults[0].querySelector('.sky-deemphasized').textContent.trim()).toBe('61');
      }));

      it('should not hide the flag in the input box if the `hideSelectedCountryFlag` is not set', fakeAsync(() => {
        component.countryFieldComponent.hideSelectedCountryFlag = false;
        fixture.detectChanges();
        tick();
        fixture.detectChanges();

        searchAndSelect('Austr', 0, fixture);
        fixture.detectChanges();
        tick();

        expect(nativeElement.querySelector('.sky-country-field-flag')).not.toBeNull();
      }));

      it('should hide the flag in the input box if the `hideSelectedCountryFlag` is set', fakeAsync(() => {
        component.countryFieldComponent.hideSelectedCountryFlag = true;
        fixture.detectChanges();
        tick();
        fixture.detectChanges();

        searchAndSelect('Austr', 0, fixture);
        fixture.detectChanges();
        tick();

        expect(nativeElement.querySelector('.sky-country-field-flag')).toBeNull();
      }));

    });

    describe('a11y', () => {

      const axeConfig = {
        rules: {
          'region': {
            enabled: false
          }
        }
      };

      it('should be accessible (empty)', async(() => {
        fixture.detectChanges();
        fixture.whenStable().then(() => {
          fixture.detectChanges();
          expect(document.body).toBeAccessible(() => {}, axeConfig);
        });
      }));

      it('should be accessible (populated)', async(() => {
        fixture.detectChanges();
        fixture.whenStable().then(() => {
          fixture.detectChanges();

          const inputElement = getInputElement();
          inputElement.value = 'Austr';

          SkyAppTestUtility.fireDomEvent(inputElement, 'input');
          fixture.detectChanges();
          fixture.whenStable().then(() => {
            fixture.detectChanges();
            fixture.whenStable().then(() => {

              const searchResults = getAutocompleteElement().querySelectorAll('.sky-autocomplete-result') as NodeListOf<HTMLElement>;

              // Note: the ordering of these events is important!
              SkyAppTestUtility.fireDomEvent(inputElement, 'change');
              SkyAppTestUtility.fireDomEvent(searchResults[0], 'mousedown');
              SkyAppTestUtility.fireDomEvent(getInputElement(), 'blur');

              fixture.detectChanges();
              fixture.whenStable().then(() => {
                fixture.detectChanges();
                expect(document.body).toBeAccessible(() => {}, axeConfig);
              });
            });
          });
        });
      }));

    });

  });

  describe('inside input box', () => {
    let fixture: ComponentFixture<CountryFieldInputBoxTestComponent>;
    let nativeElement: HTMLElement;
    let mockThemeSvc: any;

    beforeEach(() => {
      mockThemeSvc = {
        settingsChange: new BehaviorSubject<SkyThemeSettingsChange>(
          {
            currentSettings: new SkyThemeSettings(
              SkyTheme.presets.default,
              SkyThemeMode.presets.light
            ),
            previousSettings: undefined
          }
        )
      };

      TestBed.configureTestingModule({
        declarations: [
          CountryFieldInputBoxTestComponent
        ],
        imports: [
          FormsModule,
          SkyCountryFieldModule,
          SkyInputBoxModule
        ],
        providers: [
          {
            provide: SkyThemeService,
            useValue: mockThemeSvc
          }
        ]
      });

      fixture = TestBed.createComponent(CountryFieldInputBoxTestComponent);
      nativeElement = fixture.nativeElement as HTMLElement;
    });

    //#region helpers
    function setModernTheme() {
      const modernTheme = new SkyThemeSettings(
        SkyTheme.presets.modern,
        SkyThemeMode.presets.light
      );
      mockThemeSvc.settingsChange.next({
        currentSettings: modernTheme,
        previousSettings: undefined
      });
      fixture.detectChanges();
      tick();
    }
    //#endregion

    it('should render in the expected input box containers', fakeAsync(() => {
      fixture.detectChanges();

      const inputBoxEl = nativeElement.querySelector('sky-input-box');

      const inputGroupEl = inputBoxEl.querySelector('.sky-input-box-input-group-inner');
      const containerEl = inputGroupEl.children.item(1);

      expect(containerEl).toHaveCssClass('sky-country-field-container');
    }));

    it('should show an inset button in modern theme', fakeAsync(() => {
      fixture.detectChanges();
      tick();

      const inputBoxEl = nativeElement.querySelector('sky-input-box');
      let inputBoxInsetIcon = inputBoxEl.querySelector('.sky-input-box-icon-inset');
      expect(inputBoxInsetIcon).toBeNull();

      setModernTheme();

      inputBoxInsetIcon = inputBoxEl.querySelector('.sky-input-box-icon-inset');
      expect(inputBoxInsetIcon).not.toBeNull();
    }));

    it('should remove placeholder in modern theme', fakeAsync(() => {
      fixture.detectChanges();
      tick();

      const input = nativeElement.querySelector('.sky-form-control');
      expect(input.getAttribute('placeholder')).toEqual('Search for a country');

      setModernTheme();

      const modernInput = nativeElement.querySelector('.sky-form-control');
      expect(modernInput.getAttribute('placeholder')).toEqual('');
    }));

  });
});
