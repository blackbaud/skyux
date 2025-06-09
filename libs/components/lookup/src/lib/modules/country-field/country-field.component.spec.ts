import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SkyAppTestUtility, expect, expectAsync } from '@skyux-sdk/testing';

import { SkyCountryFieldModule } from './country-field.module';
import { CountryFieldInputBoxTestComponent } from './fixtures/country-field-input-box.component.fixture';
import { CountryFieldNoFormTestComponent } from './fixtures/country-field-no-form.component.fixture';
import { CountryFieldReactiveTestComponent } from './fixtures/country-field-reactive.component.fixture';
import { CountryFieldTestComponent } from './fixtures/country-field.component.fixture';
import { SKY_COUNTRY_FIELD_CONTEXT } from './types/country-field-context-token';

/* spell-checker:ignore Austr, Κύπρος */
describe('Country Field Component', () => {
  //#region helpers

  function blurInput(
    fixture: ComponentFixture<
      | CountryFieldReactiveTestComponent
      | CountryFieldInputBoxTestComponent
      | CountryFieldNoFormTestComponent
    >,
  ): void {
    SkyAppTestUtility.fireDomEvent(getInputElement(), 'blur');
    fixture.detectChanges();
    // Our blur listener has a delay of 25ms. This tick accounts for that.
    tick(25);
  }

  function enterSearch(
    newValue: string,
    fixture: ComponentFixture<
      | CountryFieldReactiveTestComponent
      | CountryFieldInputBoxTestComponent
      | CountryFieldNoFormTestComponent
    >,
  ): void {
    const inputElement = getInputElement();
    inputElement.value = newValue;

    SkyAppTestUtility.fireDomEvent(inputElement, 'focus');
    SkyAppTestUtility.fireDomEvent(inputElement, 'input');
    fixture.detectChanges();
    tick();
    fixture.detectChanges();
    tick();
  }

  function getAutocompleteElement(): HTMLElement {
    return document.querySelector('.sky-autocomplete-results') as HTMLElement;
  }

  function getDisplayedHintText(): string {
    return (
      document
        .querySelector('.sky-autocomplete-dropdown-hint-text')
        ?.textContent.trim() || ''
    );
  }

  function getInputElement(): HTMLTextAreaElement {
    return document.querySelector('textarea') as HTMLTextAreaElement;
  }

  function searchAndSelect(
    newValue: string,
    index: number,
    fixture: ComponentFixture<
      | CountryFieldReactiveTestComponent
      | CountryFieldInputBoxTestComponent
      | CountryFieldNoFormTestComponent
    >,
  ): void {
    const inputElement = getInputElement();

    enterSearch(newValue, fixture);
    const searchResults = getAutocompleteElement().querySelectorAll(
      '.sky-autocomplete-result',
    );

    // Note: the ordering of these events is important!
    SkyAppTestUtility.fireDomEvent(inputElement, 'change');
    SkyAppTestUtility.fireDomEvent(searchResults[index], 'click');
    blurInput(fixture);
  }

  function searchAndGetResults(
    newValue: string,
    fixture: ComponentFixture<
      | CountryFieldReactiveTestComponent
      | CountryFieldInputBoxTestComponent
      | CountryFieldNoFormTestComponent
    >,
  ): NodeListOf<HTMLElement> {
    enterSearch(newValue, fixture);
    return getAutocompleteElement().querySelectorAll(
      '.sky-autocomplete-result',
    );
  }

  function validateSelectedCountry(
    nativeElement: HTMLElement,
    value: string,
  ): void {
    expect(nativeElement.querySelector('textarea')?.value).toBe(value);
  }

  //#endregion

  describe('template form', () => {
    let fixture: ComponentFixture<CountryFieldTestComponent>;
    let component: CountryFieldTestComponent;
    let nativeElement: HTMLElement;

    beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [CountryFieldTestComponent],
        imports: [FormsModule, SkyCountryFieldModule],
      });

      fixture = TestBed.createComponent(CountryFieldTestComponent);
      nativeElement = fixture.nativeElement as HTMLElement;
      component = fixture.componentInstance;
    });

    describe('initialization', () => {
      it('should initialize with a set country', fakeAsync(() => {
        component.modelValue = {
          name: 'United States',
          iso2: 'us',
        };
        fixture.detectChanges();
        tick();
        fixture.detectChanges();

        validateSelectedCountry(nativeElement, 'United States');
      }));

      it('should initialize with a set country but only the iso2 code', fakeAsync(() => {
        component.modelValue = {
          iso2: 'us',
        };
        fixture.detectChanges();
        tick();
        fixture.detectChanges();

        validateSelectedCountry(nativeElement, 'United States');
      }));

      it('should initialize with a set country and fix an invalid name', fakeAsync(() => {
        component.modelValue = {
          iso2: 'us',
          name: 'Test Name',
        };
        fixture.detectChanges();
        tick();
        fixture.detectChanges();

        validateSelectedCountry(nativeElement, 'United States');
      }));

      it('should initialize without a set country', fakeAsync(() => {
        fixture.detectChanges();
        tick();
        fixture.detectChanges();

        validateSelectedCountry(nativeElement, '');
      }));

      it('should show hint text in dropdown before searching', fakeAsync(() => {
        fixture.detectChanges();

        SkyAppTestUtility.fireDomEvent(getInputElement(), 'focus');

        fixture.detectChanges();
        tick();
        fixture.detectChanges();

        expect(getDisplayedHintText()).toBe('Type to search for a country');
      }));
    });

    describe('usage', () => {
      it('should change countries correctly', fakeAsync(() => {
        component.modelValue = {
          name: 'United States',
          iso2: 'us',
        };
        fixture.detectChanges();
        tick();
        fixture.detectChanges();

        validateSelectedCountry(nativeElement, 'United States');

        searchAndSelect('Austr', 0, fixture);

        fixture.detectChanges();

        validateSelectedCountry(nativeElement, 'Australia');
      }));

      it('should change countries correctly via a model change', fakeAsync(() => {
        component.modelValue = {
          name: 'United States',
          iso2: 'us',
        };
        fixture.detectChanges();
        tick();
        fixture.detectChanges();

        validateSelectedCountry(nativeElement, 'United States');

        component.modelValue = {
          name: 'Australia',
          iso2: 'au',
        };

        fixture.detectChanges();
        tick();
        fixture.detectChanges();

        validateSelectedCountry(nativeElement, 'Australia');
      }));

      it('should change countries correctly via a model change with an invalid name', fakeAsync(() => {
        component.modelValue = {
          name: 'United States',
          iso2: 'us',
        };
        fixture.detectChanges();
        tick();
        fixture.detectChanges();

        validateSelectedCountry(nativeElement, 'United States');

        component.modelValue = {
          name: 'Test Name',
          iso2: 'au',
        };

        fixture.detectChanges();
        tick();
        fixture.detectChanges();

        validateSelectedCountry(nativeElement, 'Australia');
      }));

      it('should change countries correctly via a model change with only a iso2 code', fakeAsync(() => {
        component.modelValue = {
          name: 'United States',
          iso2: 'us',
        };
        fixture.detectChanges();
        tick();
        fixture.detectChanges();

        validateSelectedCountry(nativeElement, 'United States');

        component.modelValue = {
          name: 'Australia',
          iso2: 'au',
        };

        fixture.detectChanges();
        tick();
        fixture.detectChanges();

        validateSelectedCountry(nativeElement, 'Australia');
      }));

      it('should display the default country first in the result list with not selection', fakeAsync(() => {
        component.defaultCountry = 'cy';
        fixture.detectChanges();
        tick();
        fixture.detectChanges();

        const results = searchAndGetResults('us', fixture);

        expect(results[0]).toHaveText('Cyprus');
        expect(
          results[0].querySelector('.sky-country-field-search-result-flag div'),
        ).toHaveCssClass('iti__flag');
        expect(
          results[0].querySelector('.sky-country-field-search-result-flag div'),
        ).toHaveCssClass('iti__cy');
      }));

      it('should only display supported countries', fakeAsync(() => {
        component.defaultCountry = 'us';
        component.supportedCountryISOs = ['au', 'us'];
        fixture.detectChanges();
        tick();
        fixture.detectChanges();

        const results = searchAndGetResults('us', fixture);

        expect(results[0]).toHaveText('United States');
        expect(
          results[0].querySelector('.sky-country-field-search-result-flag div'),
        ).toHaveCssClass('iti__flag');
        expect(
          results[0].querySelector('.sky-country-field-search-result-flag div'),
        ).toHaveCssClass('iti__us');

        expect(results[1]).toHaveText('Australia');
        expect(
          results[1].querySelector('.sky-country-field-search-result-flag div'),
        ).toHaveCssClass('iti__flag');
        expect(
          results[1].querySelector('.sky-country-field-search-result-flag div'),
        ).toHaveCssClass('iti__au');

        expect(results.length).toBe(2);
      }));

      it('should display the default country second in the result list with a selection', fakeAsync(() => {
        component.modelValue = {
          name: 'United States',
          iso2: 'us',
        };
        component.defaultCountry = 'cy';
        fixture.detectChanges();
        tick();
        fixture.detectChanges();

        const results = searchAndGetResults('us', fixture);

        expect(results[0]).toHaveText('United States');
        expect(
          results[0].querySelector('.sky-country-field-search-result-flag div'),
        ).toHaveCssClass('iti__flag');
        expect(
          results[0].querySelector('.sky-country-field-search-result-flag div'),
        ).toHaveCssClass('iti__us');
        expect(results[1]).toHaveText('Cyprus');
        expect(
          results[1].querySelector('.sky-country-field-search-result-flag div'),
        ).toHaveCssClass('iti__flag');
        expect(
          results[1].querySelector('.sky-country-field-search-result-flag div'),
        ).toHaveCssClass('iti__cy');
      }));

      it('should clear the selection when all search text is cleared', fakeAsync(() => {
        component.modelValue = {
          name: 'United States',
          iso2: 'us',
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

        expect(textAreaElement.getAttribute('autocomplete')).toEqual(
          'new-custom-field',
        );
      }));

      it('should disable the field correctly', fakeAsync(() => {
        component.modelValue = {
          name: 'United States',
          iso2: 'us',
        };
        fixture.detectChanges();
        tick();
        component.isDisabled = true;
        fixture.detectChanges();
        tick();

        const textAreaElement: HTMLElement | null =
          nativeElement.querySelector('textarea');

        expect(
          textAreaElement?.attributes.getNamedItem('disabled'),
        ).not.toBeNull();
      }));

      it('should enable the field correctly', fakeAsync(() => {
        component.modelValue = {
          name: 'United States',
          iso2: 'us',
        };
        fixture.detectChanges();
        tick();
        component.isDisabled = true;
        fixture.detectChanges();
        tick();

        const textAreaElement: HTMLElement | null =
          nativeElement.querySelector('textarea');

        expect(
          textAreaElement.attributes.getNamedItem('disabled'),
        ).not.toBeNull();
        component.isDisabled = false;
        fixture.detectChanges();
        tick();

        expect(
          (
            nativeElement.querySelector('textarea') as HTMLElement
          ).attributes.getNamedItem('disabled'),
        ).toBeNull();
      }));

      it('should emit the countryChange event correctly', fakeAsync(() => {
        const changeEventSpy = spyOn(
          component,
          'countryChanged',
        ).and.callThrough();
        component.modelValue = {
          name: 'United States',
          iso2: 'us',
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
          iso2: 'au',
        });

        changeEventSpy.calls.reset();

        component.modelValue = {
          name: 'Australia',
          iso2: 'au',
        };
        fixture.detectChanges();
        tick();
        fixture.detectChanges();
        expect(changeEventSpy).not.toHaveBeenCalled();
      }));

      it('should emit the `countryFieldFocusOut` event when focus leaves autocomplete text area', fakeAsync(() => {
        fixture.detectChanges();

        const focusOutSpy = spyOn(component, 'focusLeftCountryField');
        const textAreaElement = getInputElement();
        SkyAppTestUtility.fireDomEvent(textAreaElement, 'focusout');
        fixture.detectChanges();

        expect(focusOutSpy).toHaveBeenCalled();
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
          iso2: 'us',
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
          iso2: 'xx',
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
          iso2: 'us',
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
          iso2: 'au',
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
          iso2: 'us',
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
          region: {
            enabled: false,
          },
        },
      };

      it('should be accessible (empty)', async () => {
        fixture.detectChanges();
        await fixture.whenStable();
        fixture.detectChanges();
        await expectAsync(document.body).toBeAccessible(axeConfig);
        expect(getInputElement().getAttribute('aria-label')).toBe(
          'Type to search for a country',
        );
      });

      it('should be accessible (populated)', async () => {
        component.modelValue = {
          name: 'United States',
          iso2: 'us',
        };
        fixture.detectChanges();
        await fixture.whenStable();
        fixture.detectChanges();
        await expectAsync(document.body).toBeAccessible(axeConfig);
        expect(getInputElement().getAttribute('aria-label')).toBe(
          'Type to search for a country',
        );
      });
    });
  });

  describe('reactive form', () => {
    let fixture: ComponentFixture<CountryFieldReactiveTestComponent>;
    let component: CountryFieldReactiveTestComponent;
    let nativeElement: HTMLElement;

    beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [CountryFieldReactiveTestComponent],
        imports: [ReactiveFormsModule, SkyCountryFieldModule],
      });

      fixture = TestBed.createComponent(CountryFieldReactiveTestComponent);
      nativeElement = fixture.nativeElement as HTMLElement;
      component = fixture.componentInstance;
    });

    describe('initialization', () => {
      it('should initialize with a set country', fakeAsync(() => {
        component.initialValue = {
          name: 'United States',
          iso2: 'us',
        };
        fixture.detectChanges();
        tick();
        fixture.detectChanges();

        validateSelectedCountry(nativeElement, 'United States');
      }));

      it('should initialize with a set country but only the iso2 code', fakeAsync(() => {
        component.initialValue = {
          iso2: 'us',
        };
        fixture.detectChanges();
        tick();
        fixture.detectChanges();

        validateSelectedCountry(nativeElement, 'United States');
      }));

      it('should initialize with a set country and fix an invalid name', fakeAsync(() => {
        component.initialValue = {
          iso2: 'us',
          name: 'Test Name',
        };
        fixture.detectChanges();
        tick();
        fixture.detectChanges();

        validateSelectedCountry(nativeElement, 'United States');
      }));

      it('should initialize without a set country', fakeAsync(() => {
        fixture.detectChanges();
        tick();
        fixture.detectChanges();

        expect(nativeElement.querySelector('textarea')?.value).toBe('');
      }));

      it('should show hint text in dropdown before searching', fakeAsync(() => {
        fixture.detectChanges();

        SkyAppTestUtility.fireDomEvent(getInputElement(), 'focus');

        fixture.detectChanges();
        tick();
        fixture.detectChanges();

        expect(getDisplayedHintText()).toBe('Type to search for a country');
      }));
    });

    describe('usage', () => {
      it('should change countries correctly', fakeAsync(() => {
        component.initialValue = {
          name: 'United States',
          iso2: 'us',
        };
        fixture.detectChanges();
        tick();
        fixture.detectChanges();

        validateSelectedCountry(nativeElement, 'United States');

        searchAndSelect('Austr', 0, fixture);

        fixture.detectChanges();

        validateSelectedCountry(nativeElement, 'Australia');
      }));

      it('should change countries correctly via a model change, even when disabled', fakeAsync(() => {
        component.initialValue = {
          name: 'United States',
          iso2: 'us',
        };
        fixture.detectChanges();
        tick();
        fixture.detectChanges();

        validateSelectedCountry(nativeElement, 'United States');

        component.countryControl?.setValue({
          name: 'Australia',
          iso2: 'au',
        });

        fixture.detectChanges();
        tick();
        fixture.detectChanges();

        validateSelectedCountry(nativeElement, 'Australia');

        component.countryFieldComponent.disabled = true;

        fixture.detectChanges();
        tick();
        fixture.detectChanges();

        component.countryControl?.setValue({
          name: 'United States',
          iso2: 'us',
        });

        fixture.detectChanges();
        tick();
        fixture.detectChanges();

        validateSelectedCountry(nativeElement, 'United States');
      }));

      it('should change countries correctly via a model change with an invalid name', fakeAsync(() => {
        component.initialValue = {
          name: 'United States',
          iso2: 'us',
        };
        fixture.detectChanges();
        tick();
        fixture.detectChanges();

        validateSelectedCountry(nativeElement, 'United States');

        component.countryControl?.setValue({
          name: 'Test Name',
          iso2: 'au',
        });

        fixture.detectChanges();
        tick();
        fixture.detectChanges();

        validateSelectedCountry(nativeElement, 'Australia');
      }));

      it('should change countries correctly via a model change with only a iso2 code', fakeAsync(() => {
        component.initialValue = {
          name: 'United States',
          iso2: 'us',
        };
        fixture.detectChanges();
        tick();
        fixture.detectChanges();

        validateSelectedCountry(nativeElement, 'United States');

        component.countryControl?.setValue({
          name: 'Australia',
          iso2: 'au',
        });

        fixture.detectChanges();
        tick();
        fixture.detectChanges();

        validateSelectedCountry(nativeElement, 'Australia');
      }));

      it('should display the default country first in the result list with not selection', fakeAsync(() => {
        component.defaultCountry = 'cy';
        fixture.detectChanges();
        tick();
        fixture.detectChanges();

        const results = searchAndGetResults('us', fixture);

        expect(results[0]).toHaveText('Cyprus');
        expect(
          results[0].querySelector('.sky-country-field-search-result-flag div'),
        ).toHaveCssClass('iti__flag');
        expect(
          results[0].querySelector('.sky-country-field-search-result-flag div'),
        ).toHaveCssClass('iti__cy');
      }));

      it('should only display supported countries', fakeAsync(() => {
        component.defaultCountry = 'us';
        component.supportedCountryISOs = ['au', 'us'];
        fixture.detectChanges();
        tick();
        fixture.detectChanges();

        const results = searchAndGetResults('us', fixture);

        expect(results[0]).toHaveText('United States');
        expect(
          results[0].querySelector('.sky-country-field-search-result-flag div'),
        ).toHaveCssClass('iti__flag');
        expect(
          results[0].querySelector('.sky-country-field-search-result-flag div'),
        ).toHaveCssClass('iti__us');

        expect(results[1]).toHaveText('Australia');
        expect(
          results[1].querySelector('.sky-country-field-search-result-flag div'),
        ).toHaveCssClass('iti__flag');
        expect(
          results[1].querySelector('.sky-country-field-search-result-flag div'),
        ).toHaveCssClass('iti__au');

        expect(results.length).toBe(2);
      }));

      it('should handle ISOs in mixed case', fakeAsync(() => {
        component.defaultCountry = 'us';
        component.supportedCountryISOs = ['au', 'US'];
        fixture.detectChanges();
        tick();
        fixture.detectChanges();

        const results = searchAndGetResults('us', fixture);

        expect(results[0]).toHaveText('United States');
        expect(
          results[0].querySelector('.sky-country-field-search-result-flag div'),
        ).toHaveCssClass('iti__flag');
        expect(
          results[0].querySelector('.sky-country-field-search-result-flag div'),
        ).toHaveCssClass('iti__us');

        expect(results[1]).toHaveText('Australia');
        expect(
          results[1].querySelector('.sky-country-field-search-result-flag div'),
        ).toHaveCssClass('iti__flag');
        expect(
          results[1].querySelector('.sky-country-field-search-result-flag div'),
        ).toHaveCssClass('iti__au');

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
          'Expected total number of countries to be "3".',
        );

        component.supportedCountryISOs = undefined;
        fixture.detectChanges();
        tick();
        fixture.detectChanges();

        expect(
          component.countryFieldComponent.countries.length,
        ).toBeGreaterThan(
          2,
          'Expected total number of countries to be greater than 2.',
        );
      }));

      it('should display the default country second in the result list with a selection', fakeAsync(() => {
        component.initialValue = {
          name: 'United States',
          iso2: 'us',
        };
        component.defaultCountry = 'cy';
        fixture.detectChanges();
        tick();
        fixture.detectChanges();

        const results = searchAndGetResults('us', fixture);

        expect(results[0]).toHaveText('United States');
        expect(
          results[0].querySelector('.sky-country-field-search-result-flag div'),
        ).toHaveCssClass('iti__flag');
        expect(
          results[0].querySelector('.sky-country-field-search-result-flag div'),
        ).toHaveCssClass('iti__us');
        expect(results[1]).toHaveText('Cyprus');
        expect(
          results[1].querySelector('.sky-country-field-search-result-flag div'),
        ).toHaveCssClass('iti__flag');
        expect(
          results[1].querySelector('.sky-country-field-search-result-flag div'),
        ).toHaveCssClass('iti__cy');
      }));

      it('should clear the selection when all search text is cleared', fakeAsync(() => {
        component.initialValue = {
          name: 'United States',
          iso2: 'us',
        };
        fixture.detectChanges();
        tick();
        fixture.detectChanges();

        enterSearch('', fixture);
        blurInput(fixture);

        fixture.detectChanges();
        tick();
        fixture.detectChanges();

        expect(component.countryControl?.value).toBeUndefined();
        expect(nativeElement.querySelector('textarea')?.value).toBe('');
      }));

      it('should mark the form as touched when the form loses focus', fakeAsync(() => {
        fixture.detectChanges();
        const textAreaElement = getInputElement();
        expect(component.countryForm?.touched).toEqual(false);

        SkyAppTestUtility.fireDomEvent(textAreaElement, 'blur');
        // Our blur listener has a delay of 25ms. This tick accounts for that.
        tick(25);
        fixture.detectChanges();

        expect(component.countryForm?.touched).toEqual(true);
      }));

      it('should emit the countryChange event correctly', fakeAsync(() => {
        const changeEventSpy = spyOn(
          component,
          'countryChanged',
        ).and.callThrough();
        component.initialValue = {
          name: 'United States',
          iso2: 'us',
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
          iso2: 'au',
        });

        changeEventSpy.calls.reset();

        component.setValue({
          name: 'Australia',
          iso2: 'au',
        });
        fixture.detectChanges();
        tick();
        fixture.detectChanges();
        expect(changeEventSpy).not.toHaveBeenCalled();
      }));

      it('should emit the valueChange form control event correctly with an initial value', fakeAsync(() => {
        const changeEventSpy = spyOn(
          component,
          'formValueChanged',
        ).and.callThrough();
        component.initialValue = {
          name: 'United States',
          iso2: 'us',
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
        });
      }));

      it('should emit the valueChange form control event correctly when no initial value', fakeAsync(() => {
        const changeEventSpy = spyOn(
          component,
          'formValueChanged',
        ).and.callThrough();
        fixture.detectChanges();
        tick();

        expect(changeEventSpy).not.toHaveBeenCalled();
        searchAndSelect('Austr', 0, fixture);
        fixture.detectChanges();
        tick();
        expect(changeEventSpy).toHaveBeenCalledWith({
          name: 'Australia',
          iso2: 'au',
        });
      }));

      it('should emit the valueChange form control event correctly when initialized to undefined', fakeAsync(() => {
        const changeEventSpy = spyOn(
          component,
          'formValueChanged',
        ).and.callThrough();
        component.initializeToUndefined = true;
        fixture.detectChanges();
        tick();

        expect(changeEventSpy).not.toHaveBeenCalled();
        searchAndSelect('Austr', 0, fixture);
        fixture.detectChanges();
        tick();
        expect(changeEventSpy).toHaveBeenCalledWith({
          name: 'Australia',
          iso2: 'au',
        });
      }));
    });

    describe('validation', () => {
      it('should mark the form invalid when it is empty and required', fakeAsync(() => {
        fixture.detectChanges();
        component.isRequired = true;
        fixture.detectChanges();
        tick();
        component.countryControl?.updateValueAndValidity();
        fixture.detectChanges();
        tick();
        fixture.detectChanges();

        expect(component.countryForm?.valid).toEqual(false);
      }));

      it('should mark the form valid when it is set and required', fakeAsync(() => {
        component.initialValue = {
          name: 'United States',
          iso2: 'us',
        };
        fixture.detectChanges();
        component.isRequired = true;
        fixture.detectChanges();
        tick();
        component.countryControl?.updateValueAndValidity();
        fixture.detectChanges();
        tick();
        fixture.detectChanges();

        expect(component.countryForm?.valid).toEqual(true);
      }));

      it('should mark the form invalid when it is set to a non-real country', fakeAsync(() => {
        component.initialValue = {
          name: 'Test Country',
          iso2: 'xx',
        };
        fixture.detectChanges();
        component.countryControl?.updateValueAndValidity();
        fixture.detectChanges();
        tick();
        fixture.detectChanges();

        expect(component.countryForm?.valid).toEqual(false);
      }));

      it('should mark the form valid when it is set to a real country', fakeAsync(() => {
        component.initialValue = {
          name: 'United States',
          iso2: 'us',
        };
        fixture.detectChanges();
        component.countryControl?.updateValueAndValidity();
        fixture.detectChanges();
        tick();
        fixture.detectChanges();

        expect(component.countryForm?.valid).toEqual(true);
      }));

      it('should mark the form valid when it is set to a supported country', fakeAsync(() => {
        component.initialValue = {
          name: 'Australia',
          iso2: 'au',
        };
        component.supportedCountryISOs = ['au', 'de'];
        fixture.detectChanges();
        component.countryControl?.updateValueAndValidity();
        fixture.detectChanges();
        tick();
        fixture.detectChanges();

        expect(component.countryForm?.valid).toEqual(true);
      }));

      it('should mark the form invalid when it is set to a non-supported country', fakeAsync(() => {
        component.initialValue = {
          name: 'United States',
          iso2: 'us',
        };
        component.supportedCountryISOs = ['au', 'de'];
        fixture.detectChanges();
        component.countryControl?.updateValueAndValidity();
        fixture.detectChanges();
        tick();
        fixture.detectChanges();

        expect(component.countryForm?.valid).toEqual(false);
      }));
    });

    describe('a11y', () => {
      const axeConfig = {
        rules: {
          region: {
            enabled: false,
          },
        },
      };

      it('should be accessible (empty)', async () => {
        fixture.detectChanges();
        await fixture.whenStable();
        fixture.detectChanges();
        await expectAsync(document.body).toBeAccessible(axeConfig);
        expect(getInputElement().getAttribute('aria-label')).toBe(
          'Type to search for a country',
        );
      });

      it('should be accessible (populated)', async () => {
        component.initialValue = {
          name: 'United States',
          iso2: 'us',
        };
        fixture.detectChanges();
        await fixture.whenStable();
        fixture.detectChanges();
        await expectAsync(document.body).toBeAccessible(axeConfig);
        expect(getInputElement().getAttribute('aria-label')).toBe(
          'Type to search for a country',
        );
      });
    });
  });

  describe('no form', () => {
    let fixture: ComponentFixture<CountryFieldNoFormTestComponent>;
    let component: CountryFieldNoFormTestComponent;
    let nativeElement: HTMLElement;

    beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [CountryFieldNoFormTestComponent],
        imports: [SkyCountryFieldModule],
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
        expect(nativeElement.querySelector('textarea')?.value).toBe('');

        searchAndSelect('Austr', 0, fixture);

        fixture.detectChanges();

        validateSelectedCountry(nativeElement, 'Australia');
      }));

      it('should display the default country first in the result list with not selection', fakeAsync(() => {
        component.defaultCountry = 'cy';
        fixture.detectChanges();
        tick();
        fixture.detectChanges();

        const results = searchAndGetResults('us', fixture);

        expect(results[0]).toHaveText('Cyprus');
        expect(
          results[0].querySelector('.sky-country-field-search-result-flag div'),
        ).toHaveCssClass('iti__flag');
        expect(
          results[0].querySelector('.sky-country-field-search-result-flag div'),
        ).toHaveCssClass('iti__cy');
      }));

      it('should only display supported countries', fakeAsync(() => {
        component.defaultCountry = 'us';
        component.supportedCountryISOs = ['au', 'us'];
        fixture.detectChanges();
        tick();
        fixture.detectChanges();

        const results = searchAndGetResults('us', fixture);

        expect(results[0]).toHaveText('United States');
        expect(
          results[0].querySelector('.sky-country-field-search-result-flag div'),
        ).toHaveCssClass('iti__flag');
        expect(
          results[0].querySelector('.sky-country-field-search-result-flag div'),
        ).toHaveCssClass('iti__us');

        expect(results[1]).toHaveText('Australia');
        expect(
          results[1].querySelector('.sky-country-field-search-result-flag div'),
        ).toHaveCssClass('iti__flag');
        expect(
          results[1].querySelector('.sky-country-field-search-result-flag div'),
        ).toHaveCssClass('iti__au');

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

        expect(results[0]).toHaveText('Australia');
        expect(
          results[0].querySelector('.sky-country-field-search-result-flag div'),
        ).toHaveCssClass('iti__flag');
        expect(
          results[0].querySelector('.sky-country-field-search-result-flag div'),
        ).toHaveCssClass('iti__au');
        expect(results[1]).toHaveText('Cyprus');
        expect(
          results[1].querySelector('.sky-country-field-search-result-flag div'),
        ).toHaveCssClass('iti__flag');
        expect(
          results[1].querySelector('.sky-country-field-search-result-flag div'),
        ).toHaveCssClass('iti__cy');
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

        expect(nativeElement.querySelector('textarea')?.value).toBe('');
      }));

      it('should emit the countryChange event correctly', fakeAsync(() => {
        const changeEventSpy = spyOn(
          component,
          'countryChanged',
        ).and.callThrough();
        fixture.detectChanges();
        tick();

        expect(changeEventSpy).not.toHaveBeenCalled();
        searchAndSelect('Austr', 0, fixture);
        fixture.detectChanges();
        tick();
        expect(changeEventSpy).toHaveBeenCalledWith({
          name: 'Australia',
          iso2: 'au',
        });
      }));
    });

    describe('a11y', () => {
      const axeConfig = {
        rules: {
          region: {
            enabled: false,
          },
        },
      };

      it('should be accessible (empty)', async () => {
        fixture.detectChanges();
        await fixture.whenStable();
        fixture.detectChanges();
        await expectAsync(document.body).toBeAccessible(axeConfig);
        expect(getInputElement().getAttribute('aria-label')).toBe(
          'Type to search for a country',
        );
      });

      it('should be accessible (populated)', async () => {
        fixture.detectChanges();
        await fixture.whenStable();
        fixture.detectChanges();

        const inputElement = getInputElement();
        inputElement.value = 'Austr';

        SkyAppTestUtility.fireDomEvent(inputElement, 'focus');
        SkyAppTestUtility.fireDomEvent(inputElement, 'input');
        fixture.detectChanges();
        await fixture.whenStable();
        fixture.detectChanges();
        await fixture.whenStable();

        const searchResults = getAutocompleteElement().querySelectorAll(
          '.sky-autocomplete-result',
        ) as NodeListOf<HTMLElement>;

        // Note: the ordering of these events is important!
        SkyAppTestUtility.fireDomEvent(inputElement, 'change');
        SkyAppTestUtility.fireDomEvent(searchResults[0], 'click');
        SkyAppTestUtility.fireDomEvent(getInputElement(), 'blur');

        fixture.detectChanges();
        await fixture.whenStable();
        fixture.detectChanges();
        await expectAsync(document.body).toBeAccessible(axeConfig);
        expect(getInputElement().getAttribute('aria-label')).toBe(
          'Type to search for a country',
        );
      });
    });
  });

  describe('inside input box', () => {
    let fixture: ComponentFixture<CountryFieldInputBoxTestComponent>;
    let component: CountryFieldInputBoxTestComponent;
    let nativeElement: HTMLElement;

    const axeConfig = {
      rules: {
        region: {
          enabled: false,
        },
      },
    };
    //#endregion

    describe('without country context', () => {
      beforeEach(() => {
        TestBed.configureTestingModule({
          imports: [CountryFieldInputBoxTestComponent],
        });

        fixture = TestBed.createComponent(CountryFieldInputBoxTestComponent);
        component = fixture.componentInstance;
        nativeElement = fixture.nativeElement as HTMLElement;
      });

      it('should render in the expected input box containers', fakeAsync(() => {
        fixture.detectChanges();

        const inputBoxEl = nativeElement.querySelector('sky-input-box');

        const inputGroupEl = inputBoxEl?.querySelector(
          '.sky-input-box-input-group-inner',
        );
        const containerEl = inputGroupEl?.children.item(1);

        expect(containerEl).toHaveCssClass('sky-country-field-container');
      }));

      it('should not include dial code information', fakeAsync(() => {
        const changeEventSpy = spyOn(
          component,
          'countryChanged',
        ).and.callThrough();
        fixture.detectChanges();
        tick();

        expect(changeEventSpy).not.toHaveBeenCalled();

        searchAndSelect('Austr', 0, fixture);
        fixture.detectChanges();
        tick();
        expect(changeEventSpy).toHaveBeenCalledWith({
          name: 'Australia',
          iso2: 'au',
        });

        const searchResults = searchAndGetResults('Austr', fixture);
        expect(
          searchResults[0].querySelector('.sky-font-deemphasized'),
        ).toBeNull();
      }));

      it('should set aria-describedby when hint text is specified', () => {
        fixture.componentInstance.hintText = 'Some hint text.';
        fixture.detectChanges();

        const inputEl = nativeElement.querySelector('.sky-form-control');
        const hintTextEl = nativeElement.querySelector(
          'sky-input-box .sky-input-box-hint-text',
        );

        const ariaDescribedBy = inputEl.getAttribute('aria-describedby');

        expect(ariaDescribedBy).toBeTruthy();
        expect(ariaDescribedBy).toBe(hintTextEl.id);

        fixture.componentInstance.hintText = undefined;
        fixture.detectChanges();

        expect(inputEl.hasAttribute('aria-describedby')).toBeFalse();
      });
    });

    describe('with country field context setting in a phone field', () => {
      beforeEach(() => {
        TestBed.configureTestingModule({
          imports: [CountryFieldInputBoxTestComponent],
          providers: [
            {
              provide: SKY_COUNTRY_FIELD_CONTEXT,
              useValue: { inPhoneField: true },
            },
          ],
        });

        fixture = TestBed.createComponent(CountryFieldInputBoxTestComponent);
        component = fixture.componentInstance;
        nativeElement = fixture.nativeElement as HTMLElement;
      });

      it('should include dial code information ', fakeAsync(() => {
        const changeEventSpy = spyOn(
          component,
          'countryChanged',
        ).and.callThrough();
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
        });

        const searchResults = searchAndGetResults('Austr', fixture);
        expect(
          searchResults[0].querySelector('.sky-font-deemphasized'),
        ).toHaveText('61');
      }));

      it('should be accessible (empty)', async () => {
        fixture.detectChanges();
        await fixture.whenStable();
        fixture.detectChanges();
        await expectAsync(document.body).toBeAccessible(axeConfig);
        expect(getInputElement().getAttribute('aria-label')).toBe(
          'Type to search for a country',
        );
      });

      it('should be accessible (populated)', async () => {
        component.modelValue = {
          name: 'United States',
          iso2: 'us',
        };
        fixture.detectChanges();
        await fixture.whenStable();
        fixture.detectChanges();
        await expectAsync(document.body).toBeAccessible(axeConfig);
        expect(getInputElement().getAttribute('aria-label')).toBe(
          'Type to search for a country',
        );
      });
    });

    describe('with country field context setting not in a phone field', () => {
      beforeEach(() => {
        TestBed.configureTestingModule({
          imports: [CountryFieldInputBoxTestComponent],
          providers: [
            {
              provide: SKY_COUNTRY_FIELD_CONTEXT,
              useValue: { inPhoneField: false },
            },
          ],
        });

        fixture = TestBed.createComponent(CountryFieldInputBoxTestComponent);
        component = fixture.componentInstance;
        nativeElement = fixture.nativeElement as HTMLElement;
      });

      it('should not include dial code information', fakeAsync(() => {
        const changeEventSpy = spyOn(
          component,
          'countryChanged',
        ).and.callThrough();
        fixture.detectChanges();
        tick();

        expect(changeEventSpy).not.toHaveBeenCalled();

        searchAndSelect('Austr', 0, fixture);
        fixture.detectChanges();
        tick();
        expect(changeEventSpy).toHaveBeenCalledWith({
          name: 'Australia',
          iso2: 'au',
        });

        const searchResults = searchAndGetResults('Austr', fixture);
        expect(
          searchResults[0].querySelector('.sky-font-deemphasized'),
        ).toBeNull();
      }));

      it('should be accessible (empty)', async () => {
        fixture.detectChanges();
        await fixture.whenStable();
        fixture.detectChanges();
        await fixture.whenStable();
        fixture.detectChanges();
        await expectAsync(document.body).toBeAccessible(axeConfig);
        expect(getInputElement().getAttribute('aria-label')).toBeNull();
      });

      it('should be accessible (populated)', async () => {
        component.modelValue = {
          name: 'United States',
          iso2: 'us',
        };
        fixture.detectChanges();
        await fixture.whenStable();
        fixture.detectChanges();
        await fixture.whenStable();
        fixture.detectChanges();
        await expectAsync(document.body).toBeAccessible(axeConfig);
        expect(getInputElement().getAttribute('aria-label')).toBeNull();
      });
    });
  });
});
