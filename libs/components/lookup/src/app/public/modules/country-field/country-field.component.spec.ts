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
  expect, SkyAppTestUtility
} from '@skyux-sdk/testing';

import {
  SkyCountryFieldModule
} from './country-field.module';

import {
  CountryFieldTestComponent
} from './fixtures/country-field.component.fixture';

import {
  CountryFieldNoFormTestComponent
} from './fixtures/country-field-no-form.component.fixture';

import {
  CountryFieldReactiveTestComponent
} from './fixtures/country-field-reactive.component.fixture';

describe('Country Field Component', () => {

  function blurInput(fixture: ComponentFixture<any>): void {
    SkyAppTestUtility.fireDomEvent(getInputElement(), 'blur');
    fixture.detectChanges();
    tick();
  }

  function enterSearch(newValue: string, fixture: ComponentFixture<any>): void {
    const inputElement = getInputElement();
    inputElement.value = newValue;

    SkyAppTestUtility.fireDomEvent(inputElement, 'keyup');
    fixture.detectChanges();
    tick();
    fixture.detectChanges();
    tick();
  }

  function getAutocompleteElement(): HTMLElement {
    return document.querySelector('sky-autocomplete') as HTMLElement;
  }

  function getInputElement(): HTMLTextAreaElement {
    return document.querySelector('textarea') as HTMLTextAreaElement;
  }

  function searchAndSelect(newValue: string, index: number, fixture: ComponentFixture<any>): void {
    const inputElement = getInputElement();

    enterSearch(newValue, fixture);
    const searchResults = getAutocompleteElement().querySelectorAll('.sky-dropdown-item') as NodeListOf<HTMLElement>;

    // Note: the ordering of these events is important!
    SkyAppTestUtility.fireDomEvent(inputElement, 'change');
    searchResults[index].querySelector('button').click();
    blurInput(fixture);
  }

  function searchAndGetResults(newValue: string, fixture: ComponentFixture<any>): NodeListOf<HTMLElement> {
    enterSearch(newValue, fixture);
    return getAutocompleteElement().querySelectorAll('.sky-dropdown-item') as NodeListOf<HTMLElement>;
  }

  describe('template form', () => {

    let fixture: ComponentFixture<CountryFieldTestComponent>;
    let component: CountryFieldTestComponent;
    let nativeElement: HTMLElement;

    beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [
          CountryFieldTestComponent
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

        expect(nativeElement.querySelector('textarea').value).toBe('United States');
        expect(nativeElement.querySelector('.sky-country-field-flag')).toHaveCssClass('iti-flag');
        expect(nativeElement.querySelector('.sky-country-field-flag')).toHaveCssClass('us');
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
        component.modelValue = {
          name: 'United States',
          iso2: 'us'
        };
        fixture.detectChanges();
        tick();
        fixture.detectChanges();

        expect(nativeElement.querySelector('textarea').value).toBe('United States');

        searchAndSelect('Austr', 0, fixture);

        fixture.detectChanges();

        expect(nativeElement.querySelector('textarea').value).toBe('Australia');
        expect(nativeElement.querySelector('.sky-country-field-flag')).toHaveCssClass('iti-flag');
        expect(nativeElement.querySelector('.sky-country-field-flag')).toHaveCssClass('au');
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
        expect(nativeElement.querySelector('textarea').value).toBe('');
        expect(nativeElement.querySelector('.sky-country-field-flag')).toBeNull();
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
      }));

    });

    describe('a11y', () => {

      it('should be accessible (empty)', async(() => {
        fixture.detectChanges();
        fixture.whenStable().then(() => {
          fixture.detectChanges();
          expect(nativeElement).toBeAccessible();
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
          expect(nativeElement).toBeAccessible();
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

        expect(nativeElement.querySelector('textarea').value).toBe('United States');
        expect(nativeElement.querySelector('.sky-country-field-flag')).toHaveCssClass('iti-flag');
        expect(nativeElement.querySelector('.sky-country-field-flag')).toHaveCssClass('us');
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

        expect(nativeElement.querySelector('textarea').value).toBe('United States');

        searchAndSelect('Austr', 0, fixture);

        fixture.detectChanges();

        expect(nativeElement.querySelector('textarea').value).toBe('Australia');
        expect(nativeElement.querySelector('.sky-country-field-flag')).toHaveCssClass('iti-flag');
        expect(nativeElement.querySelector('.sky-country-field-flag')).toHaveCssClass('au');
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

    });

    describe('a11y', () => {

      it('should be accessible (empty)', async(() => {
        fixture.detectChanges();
        fixture.whenStable().then(() => {
          fixture.detectChanges();
          expect(nativeElement).toBeAccessible();
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
          expect(nativeElement).toBeAccessible();
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

        expect(nativeElement.querySelector('textarea').value).toBe('Australia');
        expect(nativeElement.querySelector('.sky-country-field-flag')).toHaveCssClass('iti-flag');
        expect(nativeElement.querySelector('.sky-country-field-flag')).toHaveCssClass('au');
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

    });

    describe('a11y', () => {

      it('should be accessible (empty)', async(() => {
        fixture.detectChanges();
        fixture.whenStable().then(() => {
          fixture.detectChanges();
          expect(nativeElement).toBeAccessible();
        });
      }));

      it('should be accessible (populated)', async(() => {
        fixture.detectChanges();
        fixture.whenStable().then(() => {
          fixture.detectChanges();

          const inputElement = getInputElement();
          inputElement.value = 'Austr';

          SkyAppTestUtility.fireDomEvent(inputElement, 'keyup');
          fixture.detectChanges();
          fixture.whenStable().then(() => {
            fixture.detectChanges();
            fixture.whenStable().then(() => {

              const searchResults = getAutocompleteElement().querySelectorAll('.sky-dropdown-item') as NodeListOf<HTMLElement>;

              // Note: the ordering of these events is important!
              SkyAppTestUtility.fireDomEvent(inputElement, 'change');
              searchResults[0].querySelector('button').click();
              SkyAppTestUtility.fireDomEvent(getInputElement(), 'blur');

              fixture.detectChanges();
              fixture.whenStable().then(() => {
                fixture.detectChanges();
                expect(nativeElement).toBeAccessible();
              });
            });
          });
        });
      }));

    });

  });

});
