import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from '@angular/core/testing';
import { NgModel, UntypedFormControl } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { SkyAppTestUtility, expect, expectAsync } from '@skyux-sdk/testing';

import { PhoneFieldInputBoxTestComponent } from './fixtures/phone-field-input-box.component.fixture';
import { PhoneFieldReactiveTestComponent } from './fixtures/phone-field-reactive.component.fixture';
import { PhoneFieldTestComponent } from './fixtures/phone-field.component.fixture';

describe('Phone Field Component', () => {
  function checkCountrySearchToggleButtonFlag(
    iso: string,
    fixture: ComponentFixture<
      | PhoneFieldTestComponent
      | PhoneFieldReactiveTestComponent
      | PhoneFieldInputBoxTestComponent
    >,
  ): void {
    expect(
      getCountrySearchToggleButton(fixture).querySelector(`.iti__${iso}`),
    ).not.toBeNull();
  }

  // #region helpers
  function getPhoneFieldInput(
    fixture: ComponentFixture<
      | PhoneFieldTestComponent
      | PhoneFieldReactiveTestComponent
      | PhoneFieldInputBoxTestComponent
    >,
  ): HTMLInputElement {
    return fixture.nativeElement.querySelector('input[skyPhoneFieldInput]');
  }

  function getCountrySearchInput(
    fixture: ComponentFixture<
      | PhoneFieldTestComponent
      | PhoneFieldReactiveTestComponent
      | PhoneFieldInputBoxTestComponent
    >,
  ): HTMLInputElement {
    return fixture.nativeElement.querySelector(
      '.sky-country-field-input input, .sky-country-field-input textarea',
    );
  }

  function getCountrySearchToggleButton(
    fixture: ComponentFixture<
      | PhoneFieldTestComponent
      | PhoneFieldReactiveTestComponent
      | PhoneFieldInputBoxTestComponent
    >,
  ): HTMLInputElement {
    return fixture.nativeElement.querySelector(
      '.sky-phone-field-country-btn .sky-btn-default',
    );
  }

  function getCountrySearchDismissButton(
    fixture: ComponentFixture<
      | PhoneFieldTestComponent
      | PhoneFieldReactiveTestComponent
      | PhoneFieldInputBoxTestComponent
    >,
  ): HTMLInputElement {
    return fixture.nativeElement.querySelector(
      'button.sky-phone-field-search-btn-dismiss',
    );
  }

  function detectChangesAndTick(
    fixture: ComponentFixture<
      | PhoneFieldTestComponent
      | PhoneFieldReactiveTestComponent
      | PhoneFieldInputBoxTestComponent
    >,
  ): void {
    fixture.detectChanges();
    tick();
    fixture.detectChanges();
    tick(500);
  }

  function isPhoneFieldVisible(
    fixture: ComponentFixture<
      | PhoneFieldTestComponent
      | PhoneFieldReactiveTestComponent
      | PhoneFieldInputBoxTestComponent
    >,
  ): boolean {
    const phoneInput = getPhoneFieldInput(fixture);
    return phoneInput !== null;
  }

  function isCountryFieldVisible(
    fixture: ComponentFixture<
      | PhoneFieldTestComponent
      | PhoneFieldReactiveTestComponent
      | PhoneFieldInputBoxTestComponent
    >,
  ): boolean {
    const phoneInput = getCountrySearchInput(fixture);
    return phoneInput !== null;
  }

  function setInput(
    element: HTMLElement,
    text: string,
    compFixture: ComponentFixture<
      | PhoneFieldTestComponent
      | PhoneFieldReactiveTestComponent
      | PhoneFieldInputBoxTestComponent
    >,
    isAsync?: boolean,
  ): void {
    const inputEl = element.querySelector('input');
    if (inputEl) {
      inputEl.value = text;
    }

    SkyAppTestUtility.fireDomEvent(inputEl, 'input');
    compFixture.detectChanges();

    SkyAppTestUtility.fireDomEvent(inputEl, 'change');

    if (isAsync) {
      compFixture.detectChanges();
    } else {
      detectChangesAndTick(compFixture);
    }
  }

  // NOTE: This is very specified for a specific test to test this edge case
  function setInputChangeOnly(
    element: HTMLElement,
    text: string,
    compFixture: ComponentFixture<
      | PhoneFieldTestComponent
      | PhoneFieldReactiveTestComponent
      | PhoneFieldInputBoxTestComponent
    >,
  ): void {
    const inputEl = element.querySelector('input');
    if (inputEl) {
      inputEl.value = text;
    }

    SkyAppTestUtility.fireDomEvent(inputEl, 'change');
    compFixture.detectChanges();
    tick();
  }

  function setCountry(
    countryName: string,
    compFixture: ComponentFixture<
      | PhoneFieldTestComponent
      | PhoneFieldReactiveTestComponent
      | PhoneFieldInputBoxTestComponent
    >,
    programmaticIso2 = '',
  ): void {
    if (programmaticIso2) {
      compFixture.componentInstance.selectedCountry = {
        iso2: programmaticIso2,
      };
    } else {
      const countryInput = getCountrySearchToggleButton(compFixture);
      countryInput.click();
      detectChangesAndTick(compFixture);

      const countrySearchInput = getCountrySearchInput(compFixture);

      countrySearchInput.value = countryName;

      SkyAppTestUtility.fireDomEvent(countrySearchInput, 'input');
      detectChangesAndTick(compFixture);

      SkyAppTestUtility.fireDomEvent(
        document.querySelector('.sky-autocomplete-result:first-child'),
        'click',
      );
    }

    detectChangesAndTick(compFixture);
  }

  function searchCountry(
    countryName: string,
    compFixture: ComponentFixture<
      | PhoneFieldTestComponent
      | PhoneFieldReactiveTestComponent
      | PhoneFieldInputBoxTestComponent
    >,
  ): NodeListOf<HTMLElement> {
    const countryInput = getCountrySearchToggleButton(compFixture);
    countryInput.click();
    detectChangesAndTick(compFixture);

    const countrySearchInput: HTMLInputElement = compFixture.debugElement.query(
      By.css('textarea'),
    ).nativeElement;
    countrySearchInput.value = countryName;

    SkyAppTestUtility.fireDomEvent(countrySearchInput, 'input');
    detectChangesAndTick(compFixture);

    return document.querySelectorAll('.sky-autocomplete-result');
  }

  function blurInput(
    element: HTMLElement,
    compFixture: ComponentFixture<
      | PhoneFieldTestComponent
      | PhoneFieldReactiveTestComponent
      | PhoneFieldInputBoxTestComponent
    >,
    isAsync?: boolean,
  ): void {
    const inputEl = element.querySelector('input');

    SkyAppTestUtility.fireDomEvent(inputEl, 'blur');
    compFixture.detectChanges();

    if (!isAsync) {
      tick();
    }
  }

  function validateInputAndModel(
    inputValue: string,
    modelValue: string | undefined,
    isValid: boolean,
    isTouched: boolean,
    model: NgModel | UntypedFormControl | undefined,
    fixture: ComponentFixture<
      | PhoneFieldTestComponent
      | PhoneFieldReactiveTestComponent
      | PhoneFieldInputBoxTestComponent
    >,
  ): void {
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('input').value).toBe(inputValue);

    expect(model?.value).toBe(modelValue);

    expect(model?.valid).toBe(isValid);

    if (isValid) {
      expect(model?.errors).toBeNull();
    } else {
      expect(model?.errors).toEqual({
        skyPhoneField: {
          invalid: modelValue,
        },
      });
    }

    expect(model?.touched).toBe(isTouched);
  }
  // #endregion

  describe('template form', () => {
    let fixture: ComponentFixture<PhoneFieldTestComponent>;
    let component: PhoneFieldTestComponent;
    let nativeElement: HTMLElement;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [PhoneFieldTestComponent, NoopAnimationsModule],
      });

      fixture = TestBed.createComponent(PhoneFieldTestComponent);
      nativeElement = fixture.nativeElement as HTMLElement;
      component = fixture.componentInstance;
    });

    it('should create the component with the appropriate styles', () => {
      fixture.detectChanges();
      expect(nativeElement.querySelector('input')).toHaveCssClass(
        'sky-form-control',
      );
      expect(
        nativeElement.querySelector(
          '.sky-input-group .sky-input-group-btn .sky-btn-default',
        ),
      ).not.toBeNull();
      expect(nativeElement.querySelector('input')?.type).toEqual('tel');
    });

    it('should be accessible', async () => {
      fixture.detectChanges();

      await fixture.whenStable();
      await expectAsync(fixture.nativeElement).toBeAccessible();
    });

    describe('initialization', () => {
      it('should initialize the default country correctly', fakeAsync(() => {
        component.defaultCountry = 'us';
        detectChangesAndTick(fixture);

        checkCountrySearchToggleButtonFlag('us', fixture);
      }));

      it('should initialize without a default country', fakeAsync(() => {
        detectChangesAndTick(fixture);

        checkCountrySearchToggleButtonFlag('us', fixture);
      }));

      it('should initialize with a selected country', fakeAsync(() => {
        component.selectedCountry = {
          iso2: 'de',
          name: 'Germany',
        };
        detectChangesAndTick(fixture);

        checkCountrySearchToggleButtonFlag('de', fixture);
      }));

      it('should initialize with given supported countries', fakeAsync(() => {
        component.supportedCountryISOs = ['gb', 'uk', 'us'];
        detectChangesAndTick(fixture);

        expect(searchCountry('Un', fixture).length).toBe(2);
      }));

      it('should initialize without given supported countries', fakeAsync(() => {
        detectChangesAndTick(fixture);

        expect(searchCountry('Un', fixture).length).toBe(9);
      }));

      it('should handle initializing with number', fakeAsync(() => {
        component.modelValue = '6675555309';
        detectChangesAndTick(fixture);

        expect(nativeElement.querySelector('input')?.value).toBe('6675555309');
      }));

      it('should handle undefined initialization', fakeAsync(() => {
        detectChangesAndTick(fixture);

        expect(nativeElement.querySelector('input')?.value).toBe('');

        expect(nativeElement.querySelector('input')).not.toHaveCssClass(
          'ng-invalid',
        );
      }));

      it('should throw an error if directive is added in isolation', function () {
        try {
          component.showInvalidDirective = true;
          fixture.detectChanges();
        } catch (err) {
          let errorMessage;
          if (err instanceof Error) {
            errorMessage = err.message;
          }
          expect(errorMessage).toContain('skyPhoneFieldInput');
        }
      });
    });

    describe('input change', () => {
      it('should handle input change with a string with the expected format', fakeAsync(() => {
        detectChangesAndTick(fixture);

        setInput(nativeElement, '6675555309', fixture);
        expect(nativeElement.querySelector('input')?.value).toBe('6675555309');
        expect(component.modelValue).toEqual('(667) 555-5309');
      }));

      it('should handle input change with a string with the expected format after initially only having a change event', fakeAsync(() => {
        detectChangesAndTick(fixture);

        setInputChangeOnly(nativeElement, '5554564587', fixture);

        fixture.detectChanges();

        setInput(nativeElement, '6675555309', fixture);
        expect(nativeElement.querySelector('input')?.value).toBe('6675555309');
        expect(component.modelValue).toEqual('(667) 555-5309');
      }));

      it('should handle input change with a string with the an unexpected format', fakeAsync(() => {
        detectChangesAndTick(fixture);

        setInput(nativeElement, '66755-5-309', fixture);
        expect(nativeElement.querySelector('input')?.value).toBe('66755-5-309');
        expect(component.modelValue).toEqual('66755-5-309');
      }));
    });

    describe('model change', () => {
      it('should handle model change with a valid number', fakeAsync(() => {
        fixture.detectChanges();
        component.modelValue = '6675555309';
        detectChangesAndTick(fixture);

        expect(nativeElement.querySelector('input')?.value).toBe('6675555309');
      }));
    });

    describe('formatting', () => {
      it('should correctly format a number on the default country when no return format is given', fakeAsync(() => {
        detectChangesAndTick(fixture);

        setInput(nativeElement, '6675555309', fixture);
        expect(nativeElement.querySelector('input')?.value).toBe('6675555309');
        expect(component.modelValue).toEqual('(667) 555-5309');
      }));

      it('should correctly format a number on a non-default country when no return format is given', fakeAsync(() => {
        component.selectedCountry = {
          iso2: 'au',
          name: 'Australia',
        };
        detectChangesAndTick(fixture);

        setInput(nativeElement, '0212345678', fixture);
        expect(nativeElement.querySelector('input')?.value).toBe('0212345678');
        expect(component.modelValue).toEqual('+61 2 1234 5678');
      }));

      it('should correctly format a number on the default country when the default return format is given', fakeAsync(() => {
        component.returnFormat = 'default';
        detectChangesAndTick(fixture);

        setInput(nativeElement, '6675555309', fixture);
        expect(nativeElement.querySelector('input')?.value).toBe('6675555309');
        expect(component.modelValue).toEqual('(667) 555-5309');
      }));

      it('should correctly format a number on a non-default country when the default return format is given', fakeAsync(() => {
        component.returnFormat = 'default';
        component.selectedCountry = {
          iso2: 'au',
          name: 'Australia',
        };
        detectChangesAndTick(fixture);

        setInput(nativeElement, '0212345678', fixture);
        expect(nativeElement.querySelector('input')?.value).toBe('0212345678');
        expect(component.modelValue).toEqual('+61 2 1234 5678');
      }));

      it('should correctly format a number on the default country when the national return format is given', fakeAsync(() => {
        component.returnFormat = 'national';
        detectChangesAndTick(fixture);

        setInput(nativeElement, '6675555309', fixture);
        expect(nativeElement.querySelector('input')?.value).toBe('6675555309');
        expect(component.modelValue).toEqual('(667) 555-5309');
      }));

      it('should correctly format a number on a non-default country when the national return format is given', fakeAsync(() => {
        component.returnFormat = 'national';
        component.selectedCountry = {
          iso2: 'au',
          name: 'Australia',
        };
        detectChangesAndTick(fixture);

        setInput(nativeElement, '0212345678', fixture);
        expect(nativeElement.querySelector('input')?.value).toBe('0212345678');
        expect(component.modelValue).toEqual('(02) 1234 5678');
      }));

      it('should correctly format a number on the default country when the national return format is given', fakeAsync(() => {
        component.returnFormat = 'international';
        detectChangesAndTick(fixture);

        setInput(nativeElement, '6675555309', fixture);
        expect(nativeElement.querySelector('input')?.value).toBe('6675555309');
        expect(component.modelValue).toEqual('+1 667-555-5309');
      }));

      it('should correctly format a number on a non-default country when the national return format is given', fakeAsync(() => {
        component.returnFormat = 'international';
        component.selectedCountry = {
          iso2: 'au',
          name: 'Australia',
        };
        detectChangesAndTick(fixture);

        setInput(nativeElement, '0212345678', fixture);
        expect(nativeElement.querySelector('input')?.value).toBe('0212345678');
        expect(component.modelValue).toEqual('+61 2 1234 5678');
      }));
    });

    describe('validation', () => {
      let ngModel: NgModel;

      beforeEach(() => {
        fixture.detectChanges();
        const inputElement = fixture.debugElement.query(By.css('input'));
        ngModel = inputElement.injector.get(NgModel);
      });

      it('should validate properly when invalid number is passed through input change', async () => {
        component.defaultCountry = 'us';
        fixture.detectChanges();
        await fixture.whenStable();
        fixture.detectChanges();
        setInput(nativeElement, '123', fixture, true);
        blurInput(nativeElement, fixture, true);
        fixture.detectChanges();
        await fixture.whenStable();
        validateInputAndModel('123', '123', false, true, ngModel, fixture);
      });

      it('should validate properly when invalid number on initialization', async () => {
        component.modelValue = '1234';
        component.defaultCountry = 'us';
        fixture.detectChanges();
        await fixture.whenStable();
        fixture.detectChanges();

        validateInputAndModel('1234', '1234', false, false, ngModel, fixture);

        blurInput(fixture.nativeElement, fixture, true);

        await fixture.whenStable();
        validateInputAndModel('1234', '1234', false, true, ngModel, fixture);
      });

      it('should validate properly when invalid number format on initialization', async () => {
        component.modelValue = '667-555-530';
        component.defaultCountry = 'us';
        fixture.detectChanges();
        await fixture.whenStable();
        fixture.detectChanges();

        validateInputAndModel(
          '667-555-530',
          '667-555-530',
          false,
          false,
          ngModel,
          fixture,
        );

        blurInput(fixture.nativeElement, fixture, true);

        await fixture.whenStable();
        validateInputAndModel(
          '667-555-530',
          '667-555-530',
          false,
          true,
          ngModel,
          fixture,
        );
      });

      it('should validate properly when valid number format on initialization', async () => {
        component.modelValue = '667-555-5309';
        component.defaultCountry = 'us';
        fixture.detectChanges();
        await fixture.whenStable();
        fixture.detectChanges();

        validateInputAndModel(
          '667-555-5309',
          '(667) 555-5309',
          true,
          false,
          ngModel,
          fixture,
        );

        blurInput(fixture.nativeElement, fixture, true);

        await fixture.whenStable();
        validateInputAndModel(
          '667-555-5309',
          '(667) 555-5309',
          true,
          true,
          ngModel,
          fixture,
        );
      });

      it('should validate properly when invalid number on model change', async () => {
        component.defaultCountry = 'us';
        fixture.detectChanges();
        await fixture.whenStable();
        fixture.detectChanges();

        component.modelValue = '1234';

        fixture.detectChanges();
        await fixture.whenStable();
        validateInputAndModel('1234', '1234', false, false, ngModel, fixture);
      });

      it('should validate properly when input changed to empty string', async () => {
        component.defaultCountry = 'us';
        fixture.detectChanges();
        await fixture.whenStable();
        fixture.detectChanges();

        setInput(nativeElement, '1234', fixture, true);
        blurInput(nativeElement, fixture, true);
        fixture.detectChanges();
        await fixture.whenStable();
        fixture.detectChanges();

        setInput(fixture.nativeElement, '', fixture, true);
        blurInput(nativeElement, fixture, true);

        fixture.detectChanges();
        await fixture.whenStable();
        validateInputAndModel('', '', true, true, ngModel, fixture);
      });

      it('should handle invalid and then valid number', async () => {
        component.defaultCountry = 'us';
        fixture.detectChanges();
        await fixture.whenStable();

        setInput(fixture.nativeElement, '1234', fixture, true);
        blurInput(nativeElement, fixture, true);
        await fixture.whenStable();
        fixture.detectChanges();

        setInput(fixture.nativeElement, '6675555309', fixture, true);
        blurInput(nativeElement, fixture, true);

        fixture.detectChanges();
        await fixture.whenStable();
        validateInputAndModel(
          '6675555309',
          '(667) 555-5309',
          true,
          true,
          ngModel,
          fixture,
        );
      });

      it('should handle skyPhoneFieldNoValidate property', async () => {
        component.noValidate = true;

        fixture.detectChanges();
        await fixture.whenStable();
        fixture.detectChanges();

        setInput(fixture.nativeElement, '1234', fixture, true);

        fixture.detectChanges();
        await fixture.whenStable();
        validateInputAndModel('1234', '1234', true, false, ngModel, fixture);
      });

      it('should validate properly when a valid number with an extension is given and extensions are allowed', async () => {
        component.modelValue = '667-555-5309ext3';
        fixture.detectChanges();

        await fixture.whenStable();
        validateInputAndModel(
          '667-555-5309ext3',
          '(667) 555-5309 ext. 3',
          true,
          false,
          ngModel,
          fixture,
        );
      });

      it('should validate properly when a valid number with an extension is given and extensions are not allowed', async () => {
        component.allowExtensions = false;
        component.modelValue = '667-555-5309ext3';
        fixture.detectChanges();

        await fixture.whenStable();
        validateInputAndModel(
          '667-555-5309ext3',
          '(667) 555-5309 ext. 3',
          false,
          false,
          ngModel,
          fixture,
        );
      });

      it('should not mark the input dirty when validation fails while the field is still active', async () => {
        component.defaultCountry = 'us';
        fixture.detectChanges();
        await fixture.whenStable();

        const phoneFieldInput = getPhoneFieldInput(fixture);
        phoneFieldInput.focus();
        setInput(fixture.nativeElement, '1234', fixture, true);

        fixture.detectChanges();
        await fixture.whenStable();

        validateInputAndModel('1234', '1234', false, false, ngModel, fixture);

        blurInput(fixture.nativeElement, fixture, true);

        fixture.detectChanges();
        await fixture.whenStable();
        validateInputAndModel('1234', '1234', false, true, ngModel, fixture);
      });
    });

    describe('disabled state', () => {
      it('should disable the input and dropdown when disable is set to true', async () => {
        component.isDisabled = true;
        fixture.detectChanges();
        await fixture.whenStable();
        fixture.detectChanges();
        await fixture.whenStable();
        const countryInput = getCountrySearchToggleButton(fixture);

        expect(fixture.componentInstance.inputDirective?.disabled).toBeTruthy();
        expect(
          fixture.debugElement.query(By.css('input')).nativeElement.disabled,
        ).toBeTruthy();
        expect(countryInput.disabled).toBeTruthy();
      });

      it('should not disable the input and dropdown when disable is set to false', () => {
        component.isDisabled = false;
        fixture.detectChanges();
        const countryInput = getCountrySearchToggleButton(fixture);

        expect(fixture.componentInstance.inputDirective?.disabled).toBeFalsy();
        expect(
          fixture.debugElement.query(By.css('input')).nativeElement.disabled,
        ).toBeFalsy();
        expect(countryInput.disabled).toBeFalsy();
      });
    });

    describe('country selector', () => {
      it('should focus the country field when it is shown', fakeAsync(() => {
        fixture.detectChanges();
        const countryInput = getCountrySearchToggleButton(fixture);
        countryInput.click();
        detectChangesAndTick(fixture);

        expect(
          document.activeElement === getCountrySearchInput(fixture),
        ).toBeTruthy();
      }));

      it('should be accessible when country search is shown', async () => {
        fixture.detectChanges();
        const countryInput = getCountrySearchToggleButton(fixture);
        countryInput.click();

        fixture.detectChanges();
        await fixture.whenStable();

        fixture.detectChanges();
        await fixture.whenStable();
        await expectAsync(fixture.nativeElement).toBeAccessible();
      });

      it('should revalidate after the country is changed', fakeAsync(() => {
        fixture.detectChanges();
        const inputElement = fixture.debugElement.query(By.css('input'));
        const ngModel = inputElement.injector.get(NgModel);

        component.defaultCountry = 'us';
        fixture.detectChanges();
        component.modelValue = '6675555309';
        detectChangesAndTick(fixture);

        validateInputAndModel(
          '6675555309',
          '(667) 555-5309',
          true,
          false,
          ngModel,
          fixture,
        );

        setCountry('Albania', fixture);

        validateInputAndModel(
          '6675555309',
          '(667) 555-5309',
          false,
          true,
          ngModel,
          fixture,
        );
      }));

      it('should change to a new country based on a passed in dial code on a model change', fakeAsync(() => {
        fixture.detectChanges();
        const inputElement = fixture.debugElement.query(By.css('input'));
        const ngModel = inputElement.injector.get(NgModel);

        component.defaultCountry = 'us';
        fixture.detectChanges();
        component.modelValue = '6675555309';
        fixture.detectChanges();
        tick();
        fixture.detectChanges();
        tick();

        validateInputAndModel(
          '6675555309',
          '(667) 555-5309',
          true,
          false,
          ngModel,
          fixture,
        );

        component.modelValue = '+3556675555309';
        fixture.detectChanges();
        tick();
        fixture.detectChanges();
        tick();

        expect(component.phoneFieldComponent?.selectedCountry?.iso2).toBe('al');
        validateInputAndModel(
          '+3556675555309',
          '+3556675555309',
          false,
          false,
          ngModel,
          fixture,
        );
      }));

      it('should change to a new country based on a passed in dial code on a input change', fakeAsync(() => {
        fixture.detectChanges();
        const inputElement = fixture.debugElement.query(By.css('input'));
        const ngModel = inputElement.injector.get(NgModel);

        component.defaultCountry = 'us';
        fixture.detectChanges();
        component.modelValue = '6675555309';
        detectChangesAndTick(fixture);

        validateInputAndModel(
          '6675555309',
          '(667) 555-5309',
          true,
          false,
          ngModel,
          fixture,
        );

        setInput(nativeElement, '+3556675555309', fixture);
        blurInput(nativeElement, fixture);
        detectChangesAndTick(fixture);

        expect(component.phoneFieldComponent?.selectedCountry?.iso2).toBe('al');
        validateInputAndModel(
          '+3556675555309',
          '+3556675555309',
          false,
          true,
          ngModel,
          fixture,
        );
      }));

      it('should not change to a new country when the dial code is for an unsupported country - full number', fakeAsync(() => {
        fixture.detectChanges();
        const inputElement = fixture.debugElement.query(By.css('input'));
        const ngModel = inputElement.injector.get(NgModel);

        component.defaultCountry = 'us';
        component.supportedCountryISOs = ['us'];
        fixture.detectChanges();
        component.modelValue = '6675555309';
        detectChangesAndTick(fixture);

        validateInputAndModel(
          '6675555309',
          '(667) 555-5309',
          true,
          false,
          ngModel,
          fixture,
        );

        setInput(nativeElement, '+3556675555309', fixture);
        blurInput(nativeElement, fixture);
        detectChangesAndTick(fixture);

        expect(component.phoneFieldComponent?.selectedCountry?.iso2).toBe('us');
        validateInputAndModel(
          '+3556675555309',
          '+3556675555309',
          false,
          true,
          ngModel,
          fixture,
        );
      }));

      it('should not change to a new country when the dial code is for an unsupported country - number parse fails', fakeAsync(() => {
        fixture.detectChanges();
        const inputElement = fixture.debugElement.query(By.css('input'));
        const ngModel = inputElement.injector.get(NgModel);

        component.defaultCountry = 'us';
        component.supportedCountryISOs = ['us'];
        fixture.detectChanges();
        component.modelValue = '6675555309';
        detectChangesAndTick(fixture);

        validateInputAndModel(
          '6675555309',
          '(667) 555-5309',
          true,
          false,
          ngModel,
          fixture,
        );

        setInput(nativeElement, '+3556', fixture);
        blurInput(nativeElement, fixture);
        detectChangesAndTick(fixture);

        expect(component.phoneFieldComponent?.selectedCountry?.iso2).toBe('us');
        validateInputAndModel('+3556', '+3556', false, true, ngModel, fixture);
      }));

      it('should not change to a new country when the dial code is not found', fakeAsync(() => {
        fixture.detectChanges();
        const inputElement = fixture.debugElement.query(By.css('input'));
        const ngModel = inputElement.injector.get(NgModel);

        component.defaultCountry = 'us';
        fixture.detectChanges();
        component.modelValue = '6675555309';
        fixture.detectChanges();
        tick();
        fixture.detectChanges();
        tick();

        validateInputAndModel(
          '6675555309',
          '(667) 555-5309',
          true,
          false,
          ngModel,
          fixture,
        );

        setInput(nativeElement, '+1116675555309', fixture);
        blurInput(nativeElement, fixture);
        fixture.detectChanges();
        tick();
        fixture.detectChanges();
        tick();

        expect(component.phoneFieldComponent?.selectedCountry?.iso2).toBe('us');
        validateInputAndModel(
          '+1116675555309',
          '+1116675555309',
          false,
          true,
          ngModel,
          fixture,
        );
      }));

      it('should change to a new country and not error when only the dial code is given', fakeAsync(() => {
        fixture.detectChanges();
        const inputElement = fixture.debugElement.query(By.css('input'));
        const ngModel = inputElement.injector.get(NgModel);

        component.defaultCountry = 'us';
        fixture.detectChanges();
        component.modelValue = '6675555309';
        fixture.detectChanges();
        tick();
        fixture.detectChanges();
        tick();

        validateInputAndModel(
          '6675555309',
          '(667) 555-5309',
          true,
          false,
          ngModel,
          fixture,
        );

        setInput(nativeElement, '+61', fixture);
        blurInput(nativeElement, fixture);
        fixture.detectChanges();
        tick();
        fixture.detectChanges();
        tick();

        expect(component.phoneFieldComponent?.selectedCountry?.iso2).toBe('au');

        validateInputAndModel('+61', '+61', false, true, ngModel, fixture);
      }));

      it('should change to the default country when the dial code is given and it matches multiple countries and one is the default', fakeAsync(() => {
        fixture.detectChanges();
        const inputElement = fixture.debugElement.query(By.css('input'));
        const ngModel = inputElement.injector.get(NgModel);

        component.defaultCountry = 'ca';
        component.selectedCountry = {
          iso2: 'gb',
          name: 'Great Britain',
        };
        fixture.detectChanges();
        component.modelValue = '8008675309';
        fixture.detectChanges();
        tick();
        fixture.detectChanges();
        tick();

        validateInputAndModel(
          '8008675309',
          '+44 800 867 5309',
          true,
          false,
          ngModel,
          fixture,
        );

        setInput(nativeElement, '+1', fixture);
        blurInput(nativeElement, fixture);
        fixture.detectChanges();
        tick();
        fixture.detectChanges();
        tick();

        expect(component.phoneFieldComponent?.selectedCountry?.iso2).toBe('ca');

        validateInputAndModel('+1', '+1', false, true, ngModel, fixture);
      }));

      it('should not change the country when the dial code is given and it matches the default country but also matches the currently selected country', fakeAsync(() => {
        fixture.detectChanges();
        const inputElement = fixture.debugElement.query(By.css('input'));
        const ngModel = inputElement.injector.get(NgModel);

        component.defaultCountry = 'ca';
        component.selectedCountry = {
          iso2: 'us',
          name: 'United States',
        };
        fixture.detectChanges();
        component.modelValue = '8008675309';
        fixture.detectChanges();
        tick();
        fixture.detectChanges();
        tick();

        validateInputAndModel(
          '8008675309',
          '+1 800-867-5309',
          true,
          false,
          ngModel,
          fixture,
        );

        setInput(nativeElement, '+1', fixture);
        blurInput(nativeElement, fixture);
        fixture.detectChanges();
        tick();
        fixture.detectChanges();
        tick();

        expect(component.phoneFieldComponent?.selectedCountry?.iso2).toBe('us');

        validateInputAndModel('+1', '+1', false, true, ngModel, fixture);
      }));

      it('should change to the country with the highest priority when the dial code is given and it matches multiple countries and none are the default', fakeAsync(() => {
        fixture.detectChanges();
        const inputElement = fixture.debugElement.query(By.css('input'));
        const ngModel = inputElement.injector.get(NgModel);

        component.defaultCountry = 'au';
        component.selectedCountry = {
          iso2: 'gb',
          name: 'Great Britain',
        };
        fixture.detectChanges();
        component.modelValue = '8008675309';
        fixture.detectChanges();
        tick();
        fixture.detectChanges();
        tick();

        validateInputAndModel(
          '8008675309',
          '+44 800 867 5309',
          true,
          false,
          ngModel,
          fixture,
        );

        setInput(nativeElement, '+1', fixture);
        blurInput(nativeElement, fixture);
        fixture.detectChanges();
        tick();
        fixture.detectChanges();
        tick();

        expect(component.phoneFieldComponent?.selectedCountry?.iso2).toBe('us');

        validateInputAndModel('+1', '+1', false, true, ngModel, fixture);
      }));

      it('should change to the country first in the alphabetical list when the dial code is given and it matches multiple countries and none are the default and no priority is given', fakeAsync(() => {
        fixture.detectChanges();
        const inputElement = fixture.debugElement.query(By.css('input'));
        const ngModel = inputElement.injector.get(NgModel);

        if (component.phoneFieldComponent) {
          const unitedStates = component.phoneFieldComponent.countries.find(
            (country) => country.iso2 === 'us',
          );
          if (unitedStates) {
            unitedStates.priority = undefined;
          }
        }

        component.defaultCountry = 'au';
        component.selectedCountry = {
          iso2: 'gb',
          name: 'Great Britain',
        };
        fixture.detectChanges();
        component.modelValue = '8008675309';
        fixture.detectChanges();
        tick();
        fixture.detectChanges();
        tick();

        validateInputAndModel(
          '8008675309',
          '+44 800 867 5309',
          true,
          false,
          ngModel,
          fixture,
        );

        setInput(nativeElement, '+1', fixture);
        blurInput(nativeElement, fixture);
        fixture.detectChanges();
        tick();
        fixture.detectChanges();
        tick();

        expect(component.phoneFieldComponent?.selectedCountry?.iso2).toBe('as');

        validateInputAndModel('+1', '+1', false, true, ngModel, fixture);
      }));

      it('should change to a new country based on a valid phone number even if the dial code is the default country', fakeAsync(() => {
        fixture.detectChanges();
        const inputElement = fixture.debugElement.query(By.css('input'));
        const ngModel = inputElement.injector.get(NgModel);

        component.defaultCountry = 'us';
        fixture.detectChanges();
        component.modelValue = '6675555309';
        fixture.detectChanges();
        tick();
        fixture.detectChanges();
        tick();

        validateInputAndModel(
          '6675555309',
          '(667) 555-5309',
          true,
          false,
          ngModel,
          fixture,
        );

        component.modelValue = '+12045555555';
        fixture.detectChanges();
        tick();
        fixture.detectChanges();
        tick();

        expect(component.phoneFieldComponent?.selectedCountry?.iso2).toBe('ca');
        validateInputAndModel(
          '+12045555555',
          '+1 204-555-5555',
          true,
          false,
          ngModel,
          fixture,
        );
      }));

      it('should validate correctly after country is changed', fakeAsync(() => {
        fixture.detectChanges();
        const inputElement = fixture.debugElement.query(By.css('input'));
        const ngModel = inputElement.injector.get(NgModel);

        component.defaultCountry = 'us';
        fixture.detectChanges();
        component.modelValue = '6675555309';
        detectChangesAndTick(fixture);

        validateInputAndModel(
          '6675555309',
          '(667) 555-5309',
          true,
          false,
          ngModel,
          fixture,
        );

        setCountry('Albania', fixture);

        validateInputAndModel(
          '6675555309',
          '(667) 555-5309',
          false,
          true,
          ngModel,
          fixture,
        );

        component.modelValue = '024569874';
        detectChangesAndTick(fixture);

        validateInputAndModel(
          '024569874',
          '+355 24 569 874',
          true,
          true,
          ngModel,
          fixture,
        );
      }));

      it('should validate correctly after country is changed programmatically', fakeAsync(() => {
        fixture.detectChanges();
        const inputElement = fixture.debugElement.query(By.css('input'));
        const ngModel = inputElement.injector.get(NgModel);

        component.defaultCountry = 'us';
        fixture.detectChanges();
        component.modelValue = '6675555309';
        detectChangesAndTick(fixture);

        validateInputAndModel(
          '6675555309',
          '(667) 555-5309',
          true,
          false,
          ngModel,
          fixture,
        );

        setCountry('Albania', fixture, 'al');

        validateInputAndModel(
          '6675555309',
          '(667) 555-5309',
          false,
          false,
          ngModel,
          fixture,
        );

        component.modelValue = '024569874';
        detectChangesAndTick(fixture);

        validateInputAndModel(
          '024569874',
          '+355 24 569 874',
          true,
          false,
          ngModel,
          fixture,
        );
      }));

      it('should add the country code to non-default country data', fakeAsync(() => {
        fixture.detectChanges();
        const inputElement = fixture.debugElement.query(By.css('input'));
        const ngModel = inputElement.injector.get(NgModel);

        component.defaultCountry = 'us';
        fixture.detectChanges();
        fixture.detectChanges();
        tick();

        validateInputAndModel('', undefined, true, false, ngModel, fixture);

        setCountry('Albania', fixture);

        component.modelValue = '024569874';
        detectChangesAndTick(fixture);

        validateInputAndModel(
          '024569874',
          '+355 24 569 874',
          true,
          true,
          ngModel,
          fixture,
        );
      }));

      describe('focus handling', () => {
        it('should close country field when focus leaves phone field', fakeAsync(() => {
          fixture.detectChanges();
          const countryButton = getCountrySearchToggleButton(fixture);

          countryButton.click();
          detectChangesAndTick(fixture);

          expect(isPhoneFieldVisible(fixture)).toBeFalse();
          expect(isCountryFieldVisible(fixture)).toBeTrue();

          const countryInput = getCountrySearchInput(fixture);
          SkyAppTestUtility.fireDomEvent(countryInput, 'focusout');
          detectChangesAndTick(fixture);

          expect(isPhoneFieldVisible(fixture)).toBeTrue();
          expect(isCountryFieldVisible(fixture)).toBeFalse();
        }));

        it('should not close country field when focus moves to dismiss button', fakeAsync(() => {
          fixture.detectChanges();
          const countryButton = getCountrySearchToggleButton(fixture);

          countryButton.click();
          detectChangesAndTick(fixture);

          const relatedTarget = getCountrySearchDismissButton(
            fixture,
          ) as EventTarget;
          const countryField = getCountrySearchInput(fixture);

          countryField.dispatchEvent(
            new FocusEvent('focusout', {
              bubbles: true,
              cancelable: true,
              relatedTarget,
            }),
          );
          detectChangesAndTick(fixture);

          expect(isPhoneFieldVisible(fixture)).toBeFalse();
          expect(isCountryFieldVisible(fixture)).toBeTrue();
        }));

        it('should not close country field when focus moves to country search toggle button', fakeAsync(() => {
          fixture.detectChanges();
          const countryButton = getCountrySearchToggleButton(fixture);

          countryButton.click();
          detectChangesAndTick(fixture);

          const relatedTarget = countryButton as EventTarget;
          const countryField = getCountrySearchInput(fixture);

          countryField.dispatchEvent(
            new FocusEvent('focusout', {
              bubbles: true,
              cancelable: true,
              relatedTarget,
            }),
          );
          detectChangesAndTick(fixture);

          expect(isPhoneFieldVisible(fixture)).toBeFalse();
          expect(isCountryFieldVisible(fixture)).toBeTrue();
        }));

        it('should close country field when focus leaves dismiss button', fakeAsync(() => {
          fixture.detectChanges();
          const countryButton = getCountrySearchToggleButton(fixture);

          countryButton.click();
          detectChangesAndTick(fixture);

          const dismissButton = getCountrySearchDismissButton(fixture);
          SkyAppTestUtility.fireDomEvent(dismissButton, 'focusout');
          detectChangesAndTick(fixture);

          expect(isPhoneFieldVisible(fixture)).toBeTrue();
          expect(isCountryFieldVisible(fixture)).toBeFalse();
        }));

        it('should close country field when focus leaves country search toggle button', fakeAsync(() => {
          fixture.detectChanges();
          const countryButton = getCountrySearchToggleButton(fixture);

          countryButton.click();
          detectChangesAndTick(fixture);

          SkyAppTestUtility.fireDomEvent(countryButton, 'focusout');
          detectChangesAndTick(fixture);

          expect(isPhoneFieldVisible(fixture)).toBeTrue();
          expect(isCountryFieldVisible(fixture)).toBeFalse();
        }));

        it('should close country selector when dismiss button is clicked and move focus to phone field', fakeAsync(() => {
          fixture.detectChanges();
          const countryInput = getCountrySearchToggleButton(fixture);
          countryInput.click();
          detectChangesAndTick(fixture);

          const dismissButton = getCountrySearchDismissButton(fixture);
          dismissButton.click();
          detectChangesAndTick(fixture);

          expect(isPhoneFieldVisible(fixture)).toBeTrue();

          const phoneFieldInput = getPhoneFieldInput(fixture);
          expect(document.activeElement === phoneFieldInput).toBeTruthy();
        }));

        it('should not move focus to phone field when country field is closed due to focus leaving phone field', fakeAsync(() => {
          fixture.detectChanges();
          const countryButton = getCountrySearchToggleButton(fixture);

          countryButton.click();
          detectChangesAndTick(fixture);

          const countryField = getCountrySearchInput(fixture);
          SkyAppTestUtility.fireDomEvent(countryField, 'focusout');
          detectChangesAndTick(fixture);

          const phoneInput = getPhoneFieldInput(fixture);

          expect(document.activeElement === phoneInput).toBeFalsy();
        }));
      });
    });
  });

  describe('reactive form', () => {
    let fixture: ComponentFixture<PhoneFieldReactiveTestComponent>;
    let component: PhoneFieldReactiveTestComponent;
    let nativeElement: HTMLElement;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [PhoneFieldReactiveTestComponent, NoopAnimationsModule],
      });

      fixture = TestBed.createComponent(PhoneFieldReactiveTestComponent);
      nativeElement = fixture.nativeElement as HTMLElement;
      component = fixture.componentInstance;
    });

    afterEach(() => {
      fixture.destroy();
    });

    describe('initialization', () => {
      it('should initialize the default country correctly', fakeAsync(() => {
        component.defaultCountry = 'us';
        detectChangesAndTick(fixture);

        checkCountrySearchToggleButtonFlag('us', fixture);
      }));

      it('should initialize the default country correctly with capitalized code', fakeAsync(() => {
        component.defaultCountry = 'AU';
        detectChangesAndTick(fixture);

        checkCountrySearchToggleButtonFlag('au', fixture);
      }));

      it('should initialize without a default country', fakeAsync(() => {
        detectChangesAndTick(fixture);

        checkCountrySearchToggleButtonFlag('us', fixture);
      }));

      it('should initialize with a selected country', fakeAsync(() => {
        component.selectedCountry = {
          iso2: 'de',
          name: 'Germany',
        };
        detectChangesAndTick(fixture);

        checkCountrySearchToggleButtonFlag('de', fixture);
      }));

      it('should initialize with given supported countries', fakeAsync(() => {
        component.supportedCountryISOs = ['gb', 'uk', 'us'];
        detectChangesAndTick(fixture);

        expect(searchCountry('Un', fixture).length).toBe(2);
      }));

      it('should initialize without given supported countries', fakeAsync(() => {
        detectChangesAndTick(fixture);

        expect(searchCountry('Un', fixture).length).toBe(9);
      }));

      it('should handle initializing with number', fakeAsync(() => {
        component.initialValue = '6675555309';
        detectChangesAndTick(fixture);

        expect(nativeElement.querySelector('input')?.value).toBe('6675555309');
      }));

      it('should handle undefined initialization', fakeAsync(() => {
        detectChangesAndTick(fixture);

        expect(nativeElement.querySelector('input')?.value).toBe('');

        expect(nativeElement.querySelector('input')).not.toHaveCssClass(
          'ng-invalid',
        );
      }));

      it('should not auto-focus when added/removed to the DOM via an ngIf', fakeAsync(() => {
        detectChangesAndTick(fixture);
        component.showPhoneField = false;
        detectChangesAndTick(fixture);
        component.showPhoneField = true;
        detectChangesAndTick(fixture);
        const phoneInput = getPhoneFieldInput(fixture);

        expect(document.activeElement === phoneInput).toEqual(false);
      }));

      it('should be accessible', async () => {
        fixture.detectChanges();

        await fixture.whenStable();
        await expectAsync(fixture.nativeElement).toBeAccessible();
      });

      it('should throw an error if directive is added in isolation', function () {
        try {
          component.showInvalidDirective = true;
          fixture.detectChanges();
        } catch (err) {
          let errorMessage;
          if (err instanceof Error) {
            errorMessage = err.message;
          }
          expect(errorMessage).toContain('skyPhoneFieldInput');
        }
      });
    });

    describe('input change', () => {
      it('should handle input change with a string with the expected format', fakeAsync(() => {
        detectChangesAndTick(fixture);

        setInput(nativeElement, '6675555309', fixture);
        expect(nativeElement.querySelector('input')?.value).toBe('6675555309');
        expect(component.phoneControl?.value).toEqual('(667) 555-5309');
      }));

      it('should handle input change with a string with the expected format after initially only having a change event', fakeAsync(() => {
        detectChangesAndTick(fixture);

        setInputChangeOnly(nativeElement, '5554564587', fixture);

        fixture.detectChanges();

        setInput(nativeElement, '6675555309', fixture);
        expect(nativeElement.querySelector('input')?.value).toBe('6675555309');
        expect(component.phoneControl?.value).toEqual('(667) 555-5309');
      }));

      it('should handle input change with a string with the an unexpected format', fakeAsync(() => {
        detectChangesAndTick(fixture);

        setInput(nativeElement, '66755-5-309', fixture);
        expect(nativeElement.querySelector('input')?.value).toBe('66755-5-309');
        expect(component.phoneControl?.value).toEqual('66755-5-309');
      }));
    });

    describe('model change', () => {
      it('should handle model change with a valid number', fakeAsync(() => {
        fixture.detectChanges();
        component.phoneControl?.setValue('6675555309');
        detectChangesAndTick(fixture);

        expect(nativeElement.querySelector('input')?.value).toBe('6675555309');
      }));
    });

    describe('formatting', () => {
      it('should correctly format a number on the default country when no return format is given', fakeAsync(() => {
        detectChangesAndTick(fixture);

        setInput(nativeElement, '6675555309', fixture);
        expect(nativeElement.querySelector('input')?.value).toBe('6675555309');
        expect(component.phoneControl?.value).toEqual('(667) 555-5309');
      }));

      it('should correctly format a number on a non-default country when no return format is given', fakeAsync(() => {
        component.selectedCountry = {
          iso2: 'au',
          name: 'Australia',
        };
        detectChangesAndTick(fixture);

        setInput(nativeElement, '0212345678', fixture);
        expect(nativeElement.querySelector('input')?.value).toBe('0212345678');
        expect(component.phoneControl?.value).toEqual('+61 2 1234 5678');
      }));

      it('should correctly format a number on the default country when the default return format is given', fakeAsync(() => {
        component.returnFormat = 'default';
        detectChangesAndTick(fixture);

        setInput(nativeElement, '6675555309', fixture);
        expect(nativeElement.querySelector('input')?.value).toBe('6675555309');
        expect(component.phoneControl?.value).toEqual('(667) 555-5309');
      }));

      it('should correctly format a number on a non-default country when the default return format is given', fakeAsync(() => {
        component.returnFormat = 'default';
        component.selectedCountry = {
          iso2: 'au',
          name: 'Australia',
        };
        detectChangesAndTick(fixture);

        setInput(nativeElement, '0212345678', fixture);
        expect(nativeElement.querySelector('input')?.value).toBe('0212345678');
        expect(component.phoneControl?.value).toEqual('+61 2 1234 5678');
      }));

      it('should correctly format a number on the default country when the national return format is given', fakeAsync(() => {
        component.returnFormat = 'national';
        detectChangesAndTick(fixture);

        setInput(nativeElement, '6675555309', fixture);
        expect(nativeElement.querySelector('input')?.value).toBe('6675555309');
        expect(component.phoneControl?.value).toEqual('(667) 555-5309');
      }));

      it('should correctly format a number on a non-default country when the national return format is given', fakeAsync(() => {
        component.returnFormat = 'national';
        component.selectedCountry = {
          iso2: 'au',
          name: 'Australia',
        };
        detectChangesAndTick(fixture);

        setInput(nativeElement, '0212345678', fixture);
        expect(nativeElement.querySelector('input')?.value).toBe('0212345678');
        expect(component.phoneControl?.value).toEqual('(02) 1234 5678');
      }));

      it('should correctly format a number on the default country when the national return format is given', fakeAsync(() => {
        component.returnFormat = 'international';
        detectChangesAndTick(fixture);

        setInput(nativeElement, '6675555309', fixture);
        expect(nativeElement.querySelector('input')?.value).toBe('6675555309');
        expect(component.phoneControl?.value).toEqual('+1 667-555-5309');
      }));

      it('should correctly format a number on a non-default country when the national return format is given', fakeAsync(() => {
        component.returnFormat = 'international';
        component.selectedCountry = {
          iso2: 'au',
          name: 'Australia',
        };
        detectChangesAndTick(fixture);

        setInput(nativeElement, '0212345678', fixture);
        expect(nativeElement.querySelector('input')?.value).toBe('0212345678');
        expect(component.phoneControl?.value).toEqual('+61 2 1234 5678');
      }));
    });

    describe('validation', () => {
      it('should validate properly when invalid number is passed through input change', fakeAsync(() => {
        component.defaultCountry = 'us';
        fixture.detectChanges();
        tick();
        setInput(nativeElement, '123', fixture);
        blurInput(nativeElement, fixture);
        fixture.detectChanges();

        validateInputAndModel(
          '123',
          '123',
          false,
          true,
          component.phoneControl,
          fixture,
        );
      }));

      it('should validate properly when invalid number on initialization', fakeAsync(() => {
        component.initialValue = '1234';
        component.defaultCountry = 'us';
        detectChangesAndTick(fixture);

        validateInputAndModel(
          '1234',
          '1234',
          false,
          false,
          component.phoneControl,
          fixture,
        );

        blurInput(fixture.nativeElement, fixture);

        validateInputAndModel(
          '1234',
          '1234',
          false,
          true,
          component.phoneControl,
          fixture,
        );
      }));

      it('should validate properly when invalid number format on initialization', fakeAsync(() => {
        component.initialValue = '667-555-530';
        component.defaultCountry = 'us';
        detectChangesAndTick(fixture);

        validateInputAndModel(
          '667-555-530',
          '667-555-530',
          false,
          false,
          component.phoneControl,
          fixture,
        );

        blurInput(fixture.nativeElement, fixture);

        validateInputAndModel(
          '667-555-530',
          '667-555-530',
          false,
          true,
          component.phoneControl,
          fixture,
        );
      }));

      it('should validate properly when valid number format on initialization', fakeAsync(() => {
        component.initialValue = '667-555-5309';
        component.defaultCountry = 'us';
        detectChangesAndTick(fixture);
        validateInputAndModel(
          '667-555-5309',
          '(667) 555-5309',
          true,
          false,
          component.phoneControl,
          fixture,
        );

        blurInput(fixture.nativeElement, fixture);

        validateInputAndModel(
          '667-555-5309',
          '(667) 555-5309',
          true,
          true,
          component.phoneControl,
          fixture,
        );
      }));

      it('should validate properly when invalid number on model change', fakeAsync(() => {
        component.defaultCountry = 'us';
        detectChangesAndTick(fixture);

        component.phoneControl?.setValue('1234');

        detectChangesAndTick(fixture);

        validateInputAndModel(
          '1234',
          '1234',
          false,
          false,
          component.phoneControl,
          fixture,
        );
      }));

      it('should validate properly when input changed to empty string', fakeAsync(() => {
        component.defaultCountry = 'us';
        detectChangesAndTick(fixture);

        setInput(fixture.nativeElement, '1234', fixture);
        blurInput(nativeElement, fixture);

        setInput(fixture.nativeElement, '', fixture);
        blurInput(nativeElement, fixture);

        validateInputAndModel(
          '',
          '',
          true,
          true,
          component.phoneControl,
          fixture,
        );
      }));

      it('should handle invalid and then valid number', fakeAsync(() => {
        component.defaultCountry = 'us';
        detectChangesAndTick(fixture);

        setInput(fixture.nativeElement, '1234', fixture);
        blurInput(nativeElement, fixture);

        setInput(fixture.nativeElement, '6675555309', fixture);
        blurInput(nativeElement, fixture);

        detectChangesAndTick(fixture);

        validateInputAndModel(
          '6675555309',
          '(667) 555-5309',
          true,
          true,
          component.phoneControl,
          fixture,
        );
      }));

      it('should handle noValidate property', fakeAsync(() => {
        component.noValidate = true;

        detectChangesAndTick(fixture);

        setInput(fixture.nativeElement, '1234', fixture);

        detectChangesAndTick(fixture);

        validateInputAndModel(
          '1234',
          '1234',
          true,
          false,
          component.phoneControl,
          fixture,
        );
      }));

      it('should validate properly when a valid number with an extension is given and extensions are allowed', async () => {
        component.initialValue = '667-555-5309ext3';
        fixture.detectChanges();

        await fixture.whenStable();
        validateInputAndModel(
          '667-555-5309ext3',
          '(667) 555-5309 ext. 3',
          true,
          false,
          component.phoneControl,
          fixture,
        );
      });

      it('should validate properly when a valid number with an extension is given and extensions are not allowed', async () => {
        component.initialValue = '667-555-5309ext3';
        component.allowExtensions = false;
        fixture.detectChanges();

        await fixture.whenStable();
        validateInputAndModel(
          '667-555-5309ext3',
          '(667) 555-5309 ext. 3',
          false,
          false,
          component.phoneControl,
          fixture,
        );
      });

      it('should validate properly when a number is invalid for the current country but valid for another country with the same dial code', fakeAsync(() => {
        component.initialValue = '8675558309';
        component.defaultCountry = 'us';
        detectChangesAndTick(fixture);

        validateInputAndModel(
          '8675558309',
          '(867) 555-8309',
          false,
          false,
          component.phoneControl,
          fixture,
        );
      }));

      it('should not mark the input dirty when validation fails while the field is still active', fakeAsync(() => {
        component.defaultCountry = 'us';
        detectChangesAndTick(fixture);

        const phoneFieldInput = getPhoneFieldInput(fixture);
        phoneFieldInput.focus();
        setInput(fixture.nativeElement, '1234', fixture);

        detectChangesAndTick(fixture);

        validateInputAndModel(
          '1234',
          '1234',
          false,
          false,
          component.phoneControl,
          fixture,
        );

        blurInput(fixture.nativeElement, fixture);

        detectChangesAndTick(fixture);

        validateInputAndModel(
          '1234',
          '1234',
          false,
          true,
          component.phoneControl,
          fixture,
        );
      }));
    });

    describe('disabled state', () => {
      it('should disable the input and dropdown when disable is set to true', fakeAsync(() => {
        fixture.detectChanges();
        component.phoneControl?.disable();
        detectChangesAndTick(fixture);
        const countryInput = getCountrySearchToggleButton(fixture);

        expect(fixture.componentInstance.inputDirective?.disabled).toBeTruthy();
        expect(
          fixture.debugElement.query(By.css('input')).nativeElement.disabled,
        ).toBeTruthy();
        expect(countryInput.disabled).toBeTruthy();
      }));

      it('should not disable the input and dropdown when disable is set to false', fakeAsync(() => {
        fixture.detectChanges();
        component.phoneControl?.enable();
        detectChangesAndTick(fixture);
        const countryInput = getCountrySearchToggleButton(fixture);

        expect(fixture.componentInstance.inputDirective?.disabled).toBeFalsy();
        expect(
          fixture.debugElement.query(By.css('input')).nativeElement.disabled,
        ).toBeFalsy();
        expect(countryInput.disabled).toBeFalsy();
      }));
    });

    describe('country selector', () => {
      it('should focus the autocomplete when it is shown', fakeAsync(() => {
        fixture.detectChanges();
        const countrySearchToggleButton = getCountrySearchToggleButton(fixture);
        countrySearchToggleButton.click();
        detectChangesAndTick(fixture);
        const countryInput = getCountrySearchInput(fixture);

        expect(document.activeElement === countryInput).toBeTruthy();
      }));

      it('should focus back to the phone input when country selector is closed', fakeAsync(() => {
        fixture.detectChanges();
        const phoneInput = getPhoneFieldInput(fixture);
        const countryInput = getCountrySearchToggleButton(fixture);
        countryInput.click();
        detectChangesAndTick(fixture);

        setCountry('Canada', fixture);

        expect(document.activeElement === phoneInput).toBeTruthy();
      }));

      it('should be accessible when country search is shown', async () => {
        fixture.detectChanges();
        const countryInput = getCountrySearchToggleButton(fixture);
        countryInput.click();

        fixture.detectChanges();
        await fixture.whenStable();

        fixture.detectChanges();
        await fixture.whenStable();
        await expectAsync(fixture.nativeElement).toBeAccessible();
      });

      it('should revalidate after the country is changed', fakeAsync(() => {
        fixture.detectChanges();
        component.defaultCountry = 'us';
        fixture.detectChanges();
        component.phoneControl?.setValue('6675555309');
        detectChangesAndTick(fixture);

        validateInputAndModel(
          '6675555309',
          '(667) 555-5309',
          true,
          false,
          component.phoneControl,
          fixture,
        );

        setCountry('Albania', fixture);

        validateInputAndModel(
          '6675555309',
          '(667) 555-5309',
          false,
          true,
          component.phoneControl,
          fixture,
        );
      }));

      it('should change to a new country based on a passed in dial code on a model change', fakeAsync(() => {
        fixture.detectChanges();
        component.defaultCountry = 'us';
        fixture.detectChanges();
        component.phoneControl?.setValue('6675555309');
        fixture.detectChanges();
        tick();
        fixture.detectChanges();
        tick();

        validateInputAndModel(
          '6675555309',
          '(667) 555-5309',
          true,
          false,
          component.phoneControl,
          fixture,
        );

        component.phoneControl?.setValue('+3556675555309');
        fixture.detectChanges();
        tick();
        fixture.detectChanges();
        tick();

        expect(component.phoneFieldComponent?.selectedCountry?.iso2).toBe('al');
        validateInputAndModel(
          '+3556675555309',
          '+3556675555309',
          false,
          false,
          component.phoneControl,
          fixture,
        );
      }));

      it('should change to a new country based on a passed in dial code on a input change', fakeAsync(() => {
        fixture.detectChanges();
        component.defaultCountry = 'us';
        fixture.detectChanges();
        component.phoneControl?.setValue('6675555309');
        fixture.detectChanges();
        tick();
        fixture.detectChanges();
        tick();

        validateInputAndModel(
          '6675555309',
          '(667) 555-5309',
          true,
          false,
          component.phoneControl,
          fixture,
        );

        setInput(nativeElement, '+3556675555309', fixture);
        blurInput(nativeElement, fixture);
        fixture.detectChanges();
        tick();
        fixture.detectChanges();
        tick();

        expect(component.phoneFieldComponent?.selectedCountry?.iso2).toBe('al');
        validateInputAndModel(
          '+3556675555309',
          '+3556675555309',
          false,
          true,
          component.phoneControl,
          fixture,
        );
      }));

      it('should not change to a new country when the dial code is for an unsupported country', fakeAsync(() => {
        fixture.detectChanges();
        component.defaultCountry = 'us';
        component.supportedCountryISOs = ['us'];
        fixture.detectChanges();
        component.phoneControl?.setValue('6675555309');
        fixture.detectChanges();
        tick();
        fixture.detectChanges();
        tick();

        validateInputAndModel(
          '6675555309',
          '(667) 555-5309',
          true,
          false,
          component.phoneControl,
          fixture,
        );

        setInput(nativeElement, '+3556675555309', fixture);
        blurInput(nativeElement, fixture);
        fixture.detectChanges();
        tick();
        fixture.detectChanges();
        tick();

        expect(component.phoneFieldComponent?.selectedCountry?.iso2).toBe('us');
        validateInputAndModel(
          '+3556675555309',
          '+3556675555309',
          false,
          true,
          component.phoneControl,
          fixture,
        );
      }));

      it('should not change to a new country when the dial code is not found', fakeAsync(() => {
        fixture.detectChanges();
        component.defaultCountry = 'us';
        fixture.detectChanges();
        component.phoneControl?.setValue('6675555309');
        fixture.detectChanges();
        tick();
        fixture.detectChanges();
        tick();

        validateInputAndModel(
          '6675555309',
          '(667) 555-5309',
          true,
          false,
          component.phoneControl,
          fixture,
        );

        setInput(nativeElement, '+1116675555309', fixture);
        blurInput(nativeElement, fixture);
        detectChangesAndTick(fixture);

        expect(component.phoneFieldComponent?.selectedCountry?.iso2).toBe('us');
        validateInputAndModel(
          '+1116675555309',
          '+1116675555309',
          false,
          true,
          component.phoneControl,
          fixture,
        );
      }));

      it('should change to a new country and not error when only the dial code is given', fakeAsync(() => {
        fixture.detectChanges();

        component.defaultCountry = 'us';
        fixture.detectChanges();
        component.phoneControl?.setValue('6675555309');
        fixture.detectChanges();
        tick();
        fixture.detectChanges();
        tick();

        validateInputAndModel(
          '6675555309',
          '(667) 555-5309',
          true,
          false,
          component.phoneControl,
          fixture,
        );

        setInput(nativeElement, '+61', fixture);
        blurInput(nativeElement, fixture);
        detectChangesAndTick(fixture);

        expect(component.phoneFieldComponent?.selectedCountry?.iso2).toBe('au');
        validateInputAndModel(
          '+61',
          '+61',
          false,
          true,
          component.phoneControl,
          fixture,
        );
      }));

      it('should validate correctly after country is changed', fakeAsync(() => {
        fixture.detectChanges();
        component.defaultCountry = 'us';
        fixture.detectChanges();
        component.phoneControl?.setValue('6675555309');
        detectChangesAndTick(fixture);

        validateInputAndModel(
          '6675555309',
          '(667) 555-5309',
          true,
          false,
          component.phoneControl,
          fixture,
        );

        setCountry('Albania', fixture);

        validateInputAndModel(
          '6675555309',
          '(667) 555-5309',
          false,
          true,
          component.phoneControl,
          fixture,
        );

        component.phoneControl?.setValue('024569874');
        detectChangesAndTick(fixture);

        validateInputAndModel(
          '024569874',
          '+355 24 569 874',
          true,
          true,
          component.phoneControl,
          fixture,
        );
      }));

      it('should validate correctly after country is changed programmatically', fakeAsync(() => {
        fixture.detectChanges();
        component.defaultCountry = 'us';
        fixture.detectChanges();
        component.phoneControl?.setValue('6675555309');
        detectChangesAndTick(fixture);

        validateInputAndModel(
          '6675555309',
          '(667) 555-5309',
          true,
          false,
          component.phoneControl,
          fixture,
        );

        setCountry('Albania', fixture, 'al');

        validateInputAndModel(
          '6675555309',
          '(667) 555-5309',
          false,
          false,
          component.phoneControl,
          fixture,
        );

        component.phoneControl?.setValue('024569874');
        detectChangesAndTick(fixture);

        validateInputAndModel(
          '024569874',
          '+355 24 569 874',
          true,
          false,
          component.phoneControl,
          fixture,
        );
      }));

      it('should add the country code to non-default country data', fakeAsync(() => {
        fixture.detectChanges();
        component.defaultCountry = 'us';
        detectChangesAndTick(fixture);

        setCountry('Albania', fixture);

        component.phoneControl?.setValue('024569874');
        detectChangesAndTick(fixture);

        validateInputAndModel(
          '024569874',
          '+355 24 569 874',
          true,
          true,
          component.phoneControl,
          fixture,
        );
      }));
    });
  });

  describe('inside input box', () => {
    let fixture: ComponentFixture<PhoneFieldInputBoxTestComponent>;
    let nativeElement: HTMLElement;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [PhoneFieldInputBoxTestComponent, NoopAnimationsModule],
      });

      fixture = TestBed.createComponent(PhoneFieldInputBoxTestComponent);
      nativeElement = fixture.nativeElement as HTMLElement;
    });

    it('should set validate new value on input', fakeAsync(() => {
      detectChangesAndTick(fixture);

      const inputEl = nativeElement.querySelector('input');
      if (inputEl) {
        inputEl.value = '667555530';
      }

      SkyAppTestUtility.fireDomEvent(inputEl, 'input');
      fixture.detectChanges();

      const model = fixture.debugElement
        .query(By.css('input'))
        .injector.get(NgModel);

      expect(model.errors).toEqual({
        skyPhoneField: {
          invalid: '667555530',
        },
      });

      if (inputEl) {
        inputEl.value = '6675555309';
      }

      SkyAppTestUtility.fireDomEvent(inputEl, 'input');
      fixture.detectChanges();

      expect(model.errors).toBeNull();
    }));

    it('should render in the expected input box containers', fakeAsync(() => {
      detectChangesAndTick(fixture);

      const inputBoxEl = nativeElement.querySelector('sky-input-box');

      const inputGroupEl = inputBoxEl?.querySelector(
        '.sky-form-group > .sky-input-group',
      );
      const countryBtnEl = inputGroupEl?.children.item(0);
      const containerEl = inputGroupEl?.children.item(1)?.children.item(1);

      expect(countryBtnEl).toHaveCssClass('sky-phone-field-country-btn');
      expect(containerEl).toHaveCssClass('sky-phone-field-container');
    }));

    it('should show hint text for the the default date format', fakeAsync(() => {
      detectChangesAndTick(fixture);
      tick();

      const inputBoxEl = fixture.nativeElement.querySelector('sky-input-box');
      const hintText = inputBoxEl
        .querySelector('.sky-input-box-hint-text')
        .textContent.trim();

      expect(hintText).toEqual('Example: (201) 555-0123.');
    }));

    it('should show hint text for the the consumer provided date format', fakeAsync(() => {
      detectChangesAndTick(fixture);

      setCountry('United Kingdom', fixture);

      const inputBoxEl = fixture.nativeElement.querySelector('sky-input-box');
      const hintText = inputBoxEl
        .querySelector('.sky-input-box-hint-text')
        .textContent.trim();

      expect(hintText).toEqual('Example: 0121 234 5678.');
    }));

    it('should allow consumer to provide hint text along with the format hint text', fakeAsync(() => {
      fixture.componentInstance.hintText = 'Enter a phone number.';
      detectChangesAndTick(fixture);

      const inputBoxEl = fixture.nativeElement.querySelector('sky-input-box');
      const hintText = inputBoxEl
        .querySelector('.sky-input-box-hint-text')
        .textContent.trim();

      expect(hintText).toEqual(
        'Enter a phone number. Example: (201) 555-0123.',
      );
    }));

    it('should hide hint text when the country search is toggled', fakeAsync(() => {
      detectChangesAndTick(fixture);
      tick();
      getCountrySearchToggleButton(fixture).click();
      detectChangesAndTick(fixture);

      const inputBoxEl = fixture.nativeElement.querySelector('sky-input-box');
      const hintTextEl = inputBoxEl.querySelector('.sky-input-box-hint-text');

      expect(hintTextEl).not.toBeVisible({ checkCssVisibility: true });
    }));

    describe('country selector', () => {
      describe('focus handling', () => {
        it('should close country field when focus leaves phone field', fakeAsync(() => {
          detectChangesAndTick(fixture);
          const countryButton = getCountrySearchToggleButton(fixture);

          countryButton.click();
          detectChangesAndTick(fixture);

          expect(isPhoneFieldVisible(fixture)).toBeFalse();
          expect(isCountryFieldVisible(fixture)).toBeTrue();

          const countryInput = getCountrySearchInput(fixture);
          countryInput.dispatchEvent(
            new FocusEvent('focusout', {
              bubbles: true,
              cancelable: true,
              relatedTarget:
                fixture.nativeElement.querySelector('.focus-out-target'),
            }),
          );
          detectChangesAndTick(fixture);

          expect(isPhoneFieldVisible(fixture)).toBeTrue();
          expect(isCountryFieldVisible(fixture)).toBeFalse();
        }));

        it('should not close country field when focus moves to dismiss button', fakeAsync(() => {
          detectChangesAndTick(fixture);
          const countryButton = getCountrySearchToggleButton(fixture);

          countryButton.click();
          detectChangesAndTick(fixture);

          const relatedTarget = getCountrySearchDismissButton(
            fixture,
          ) as EventTarget;
          const countryField = getCountrySearchInput(fixture);

          countryField.dispatchEvent(
            new FocusEvent('focusout', {
              bubbles: true,
              cancelable: true,
              relatedTarget,
            }),
          );
          detectChangesAndTick(fixture);

          expect(isPhoneFieldVisible(fixture)).toBeFalse();
          expect(isCountryFieldVisible(fixture)).toBeTrue();
        }));

        it('should not close country field when focus moves to country search toggle button', fakeAsync(() => {
          detectChangesAndTick(fixture);
          const countryButton = getCountrySearchToggleButton(fixture);

          countryButton.click();
          detectChangesAndTick(fixture);

          const relatedTarget = countryButton as EventTarget;
          const countryField = getCountrySearchInput(fixture);

          countryField.dispatchEvent(
            new FocusEvent('focusout', {
              bubbles: true,
              cancelable: true,
              relatedTarget,
            }),
          );
          detectChangesAndTick(fixture);

          expect(isPhoneFieldVisible(fixture)).toBeFalse();
          expect(isCountryFieldVisible(fixture)).toBeTrue();
        }));

        it('should close country field when focus leaves country search toggle button', fakeAsync(() => {
          detectChangesAndTick(fixture);
          const countryButton = getCountrySearchToggleButton(fixture);

          countryButton.click();
          detectChangesAndTick(fixture);

          const relatedTarget =
            fixture.nativeElement.querySelector('.focus-out-target');
          countryButton.dispatchEvent(
            new FocusEvent('focusout', {
              bubbles: true,
              cancelable: true,
              relatedTarget,
            }),
          );
          detectChangesAndTick(fixture);

          expect(isPhoneFieldVisible(fixture)).toBeTrue();
          expect(isCountryFieldVisible(fixture)).toBeFalse();
        }));
      });
    });
  });
});
