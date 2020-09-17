import {
  async,
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick
} from '@angular/core/testing';

import {
  FormsModule,
  NgModel,
  ReactiveFormsModule
} from '@angular/forms';

import {
  By
} from '@angular/platform-browser';

import {
  NoopAnimationsModule
} from '@angular/platform-browser/animations';

import {
  expect,
  SkyAppTestUtility
} from '@skyux-sdk/testing';

import {
  SkyPhoneFieldModule
} from './phone-field.module';

import {
  PhoneFieldTestComponent
} from './fixtures/phone-field.component.fixture';

import {
  PhoneFieldReactiveTestComponent
} from './fixtures/phone-field-reactive.component.fixture';

describe('Phone Field Component', () => {

  // #region helpers
  function getPhoneFieldInput(fixture: ComponentFixture<any>): HTMLInputElement {
    return fixture.nativeElement.querySelector('input[skyPhoneFieldInput]');
  }

  function getCountrySearchInput(fixture: ComponentFixture<any>): HTMLInputElement {
    return fixture.nativeElement.querySelector('.sky-phone-field-country-search textarea');
  }

  function getCountrySearchToggleButton(fixture: ComponentFixture<any>): HTMLInputElement {
    return fixture.nativeElement.querySelector('.sky-phone-field-country-btn .sky-btn-default');
  }

  function detectChangesAndTick(fixture: ComponentFixture<any>): void {
    fixture.detectChanges();
    tick();
    fixture.detectChanges();
    tick(500);
  }

  function setInput(
    element: HTMLElement,
    text: string,
    compFixture: ComponentFixture<any>,
    isAsync?: boolean): void {
    let inputEl = element.querySelector('input');
    inputEl.value = text;

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
    compFixture: ComponentFixture<any>): void {
    let inputEl = element.querySelector('input');
    inputEl.value = text;

    SkyAppTestUtility.fireDomEvent(inputEl, 'change');
    compFixture.detectChanges();
    tick();
  }

  function setCountry(countryName: string, compFixture: ComponentFixture<any>) {
    const countryInput = getCountrySearchToggleButton(compFixture);
    countryInput.click();
    detectChangesAndTick(compFixture);

    let countrySearchInput: HTMLInputElement = compFixture.debugElement.query(By.css('textarea'))
      .nativeElement;
    countrySearchInput.value = countryName;

    SkyAppTestUtility.fireDomEvent(countrySearchInput, 'keyup');
    detectChangesAndTick(compFixture);

    SkyAppTestUtility.fireDomEvent(
      document.querySelector('.sky-autocomplete-result:first-child'),
      'mousedown'
    );
    detectChangesAndTick(compFixture);
  }

  function blurInput(
    element: HTMLElement,
    compFixture: ComponentFixture<any>,
    isAsync?: boolean): void {
    let inputEl = element.querySelector('input');

    SkyAppTestUtility.fireDomEvent(inputEl, 'blur');
    compFixture.detectChanges();

    if (!isAsync) {
      tick();
    }
  }
  // #endregion

  describe('template form', () => {

    let fixture: ComponentFixture<PhoneFieldTestComponent>;
    let component: PhoneFieldTestComponent;
    let nativeElement: HTMLElement;

    beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [
          PhoneFieldTestComponent
        ],
        imports: [
          SkyPhoneFieldModule,
          NoopAnimationsModule,
          FormsModule
        ]
      });

      fixture = TestBed.createComponent(PhoneFieldTestComponent);
      nativeElement = fixture.nativeElement as HTMLElement;
      component = fixture.componentInstance;
    });

    it('should create the component with the appropriate styles', () => {
      fixture.detectChanges();
      expect(nativeElement.querySelector('input')).toHaveCssClass('sky-form-control');
      expect(nativeElement
        .querySelector('.sky-input-group .sky-input-group-btn .sky-btn-default'))
        .not.toBeNull();
    });

    it('should be accessible', (done) => {
      fixture.detectChanges();

      fixture.whenStable().then(() => {
        expect(fixture.nativeElement).toBeAccessible();
        done();
      });
    });

    describe('initialization', () => {

      it('should initialize the default country correctly', fakeAsync(() => {
        component.defaultCountry = 'us';
        detectChangesAndTick(fixture);

        expect(nativeElement.querySelector('input').placeholder)
          .toBe(component.phoneFieldComponent.countries
            .find(country => country.iso2 === 'us').exampleNumber);
      }));

      it('should initialize without a default country', fakeAsync(() => {
        detectChangesAndTick(fixture);

        expect(nativeElement.querySelector('input').placeholder)
          .toBe(component.phoneFieldComponent.countries.find(country => country.iso2 === 'us').exampleNumber);
      }));

      it('should initialize with a selected country', fakeAsync(() => {
        component.selectedCountry = {
          iso2: 'de',
          name: 'Germany'
        };
        detectChangesAndTick(fixture);

        expect(nativeElement.querySelector('input').placeholder)
          .toBe(component.phoneFieldComponent.countries.find(country => country.iso2 === 'de').exampleNumber);
      }));

      it('should handle initializing with number', fakeAsync(() => {
        component.modelValue = '8675555309';
        detectChangesAndTick(fixture);

        expect(nativeElement.querySelector('input').value).toBe('8675555309');
      }));

      it('should handle undefined initialization', fakeAsync(() => {
        detectChangesAndTick(fixture);

        expect(nativeElement.querySelector('input').value).toBe('');

        expect(nativeElement.querySelector('input')).not.toHaveCssClass('ng-invalid');
      }));

      it('should throw an error if directive is added in isolation', function () {
        try {
          component.showInvalidDirective = true;
          fixture.detectChanges();
        } catch (err) {
          expect(err.message).toContain('skyPhoneFieldInput');
        }
      });

    });

    describe('input change', () => {

      it('should handle input change with a string with the expected format', fakeAsync(() => {
        detectChangesAndTick(fixture);

        setInput(nativeElement, '8675555309', fixture);
        expect(nativeElement.querySelector('input').value).toBe('8675555309');
        expect(component.modelValue).toEqual('(867) 555-5309');
      }));

      it('should handle input change with a string with the expected format after initially only haveing a change event', fakeAsync(() => {
        detectChangesAndTick(fixture);

        setInputChangeOnly(nativeElement, '5554564587', fixture);

        fixture.detectChanges();

        setInput(nativeElement, '8675555309', fixture);
        expect(nativeElement.querySelector('input').value).toBe('8675555309');
        expect(component.modelValue).toEqual('(867) 555-5309');
      }));

      it('should handle input change with a string with the an unexpected format', fakeAsync(() => {
        detectChangesAndTick(fixture);

        setInput(nativeElement, '86755-5-309', fixture);
        expect(nativeElement.querySelector('input').value).toBe('86755-5-309');
        expect(component.modelValue).toEqual('86755-5-309');
      }));

    });

    describe('model change', () => {

      it('should handle model change with a valid number', fakeAsync(() => {
        fixture.detectChanges();
        component.modelValue = '8675555309';
        detectChangesAndTick(fixture);

        expect(nativeElement.querySelector('input').value).toBe('8675555309');
      }));

    });

    describe('formatting', () => {

      it('should correctly format a number on the default country when no return format is given', fakeAsync(() => {
        detectChangesAndTick(fixture);

        setInput(nativeElement, '8675555309', fixture);
        expect(nativeElement.querySelector('input').value).toBe('8675555309');
        expect(component.modelValue).toEqual('(867) 555-5309');
      }));

      it('should correctly format a number on a non-default country when no return format is given', fakeAsync(() => {
        component.selectedCountry = {
          iso2: 'au',
          name: 'Australia'
        };
        detectChangesAndTick(fixture);

        setInput(nativeElement, '0212345678', fixture);
        expect(nativeElement.querySelector('input').value).toBe('0212345678');
        expect(component.modelValue).toEqual('+61 2 1234 5678');
      }));

      it('should correctly format a number on the default country when the default return format is given', fakeAsync(() => {
        component.returnFormat = 'default';
        detectChangesAndTick(fixture);

        setInput(nativeElement, '8675555309', fixture);
        expect(nativeElement.querySelector('input').value).toBe('8675555309');
        expect(component.modelValue).toEqual('(867) 555-5309');
      }));

      it('should correctly format a number on a non-default country when the default return format is given', fakeAsync(() => {
        component.returnFormat = 'default';
        component.selectedCountry = {
          iso2: 'au',
          name: 'Australia'
        };
        detectChangesAndTick(fixture);

        setInput(nativeElement, '0212345678', fixture);
        expect(nativeElement.querySelector('input').value).toBe('0212345678');
        expect(component.modelValue).toEqual('+61 2 1234 5678');
      }));

      it('should correctly format a number on the default country when the national return format is given', fakeAsync(() => {
        component.returnFormat = 'national';
        detectChangesAndTick(fixture);

        setInput(nativeElement, '8675555309', fixture);
        expect(nativeElement.querySelector('input').value).toBe('8675555309');
        expect(component.modelValue).toEqual('(867) 555-5309');
      }));

      it('should correctly format a number on a non-default country when the national return format is given', fakeAsync(() => {
        component.returnFormat = 'national';
        component.selectedCountry = {
          iso2: 'au',
          name: 'Australia'
        };
        detectChangesAndTick(fixture);

        setInput(nativeElement, '0212345678', fixture);
        expect(nativeElement.querySelector('input').value).toBe('0212345678');
        expect(component.modelValue).toEqual('(02) 1234 5678');
      }));

      it('should correctly format a number on the default country when the national return format is given', fakeAsync(() => {
        component.returnFormat = 'international';
        detectChangesAndTick(fixture);

        setInput(nativeElement, '8675555309', fixture);
        expect(nativeElement.querySelector('input').value).toBe('8675555309');
        expect(component.modelValue).toEqual('+1 867-555-5309');
      }));

      it('should correctly format a number on a non-default country when the national return format is given', fakeAsync(() => {
        component.returnFormat = 'international';
        component.selectedCountry = {
          iso2: 'au',
          name: 'Australia'
        };
        detectChangesAndTick(fixture);

        setInput(nativeElement, '0212345678', fixture);
        expect(nativeElement.querySelector('input').value).toBe('0212345678');
        expect(component.modelValue).toEqual('+61 2 1234 5678');
      }));

    });

    describe('validation', () => {
      let ngModel: NgModel;

      beforeEach(() => {
        fixture.detectChanges();
        let inputElement = fixture.debugElement.query(By.css('input'));
        ngModel = <NgModel>inputElement.injector.get(NgModel);
      });

      it('should validate properly when invalid number is passed through input change',
        async(() => {
          component.defaultCountry = 'us';
          fixture.detectChanges();
          fixture.whenStable().then(() => {
            fixture.detectChanges();
            setInput(nativeElement, '123', fixture, true);
            fixture.detectChanges();
            fixture.whenStable().then(() => {
              fixture.detectChanges();

              expect(nativeElement.querySelector('input').value).toBe('123');

              expect(component.modelValue)
                .toBe('123');

              expect(ngModel.valid).toBe(false);
              expect(ngModel.errors).toEqual({
                'skyPhoneField': {
                  invalid: '123'
                }
              });

              expect(ngModel.pristine).toBe(false);
              expect(ngModel.touched).toBe(true);
            });
          });
        }));

      it('should validate properly when invalid number on initialization', async(() => {
        component.modelValue = '1234';
        component.defaultCountry = 'us';
        fixture.detectChanges();
        fixture.whenStable().then(() => {
          fixture.detectChanges();

          expect(nativeElement.querySelector('input').value).toBe('1234');

          expect(component.modelValue)
            .toBe('1234');

          expect(ngModel.valid).toBe(false);
          expect(ngModel.errors).toEqual({
            'skyPhoneField': {
              invalid: '1234'
            }
          });

          expect(ngModel.touched).toBe(true);

          blurInput(fixture.nativeElement, fixture, true);
          fixture.detectChanges();
          fixture.whenStable().then(() => {
            fixture.detectChanges();

            expect(ngModel.valid).toBe(false);
            expect(ngModel.errors).toEqual({
              'skyPhoneField': {
                invalid: '1234'
              }
            });

            expect(ngModel.touched).toBe(true);
          });
        });
      }));

      it('should validate properly when invalid number format on initialization', async(() => {
        component.modelValue = '867-555-530';
        component.defaultCountry = 'us';
        fixture.detectChanges();
        fixture.whenStable().then(() => {
          fixture.detectChanges();

          expect(nativeElement.querySelector('input').value).toBe('867-555-530');

          expect(component.modelValue)
            .toBe('867-555-530');

          expect(ngModel.valid).toBe(false);

          expect(ngModel.touched).toBe(true);

          blurInput(fixture.nativeElement, fixture, true);
          fixture.detectChanges();
          fixture.whenStable().then(() => {
            fixture.detectChanges();

            expect(ngModel.valid).toBe(false);
            expect(ngModel.errors).toEqual({
              'skyPhoneField': {
                invalid: '867-555-530'
              }
            });

            expect(ngModel.touched).toBe(true);
          });
        });
      }));

      it('should validate properly when valid number format on initialization', async(() => {
        component.modelValue = '867-555-5309';
        component.defaultCountry = 'us';
        fixture.detectChanges();
        fixture.whenStable().then(() => {
          fixture.detectChanges();

          expect(nativeElement.querySelector('input').value).toBe('867-555-5309');

          expect(component.modelValue)
            .toBe('(867) 555-5309');

          expect(ngModel.valid).toBe(true);
          expect(ngModel.errors).toBeNull();

          expect(ngModel.touched).toBe(false);

          blurInput(fixture.nativeElement, fixture, true);
          fixture.detectChanges();
          fixture.whenStable().then(() => {
            fixture.detectChanges();
            expect(ngModel.valid).toBe(true);
            expect(ngModel.errors).toBeNull();
            expect(ngModel.touched).toBe(true);
          });
        });
      }));

      it('should validate properly when invalid number on model change', async(() => {
        component.defaultCountry = 'us';
        fixture.detectChanges();
        fixture.whenStable().then(() => {
          fixture.detectChanges();

          component.modelValue = '1234';

          fixture.detectChanges();
          fixture.whenStable().then(() => {
            fixture.detectChanges();

            expect(nativeElement.querySelector('input').value).toBe('1234');

            expect(component.modelValue)
              .toBe('1234');

            expect(ngModel.valid).toBe(false);
            expect(ngModel.errors).toEqual({
              'skyPhoneField': {
                invalid: '1234'
              }
            });
          });
        });
      }));

      it('should validate properly when input changed to empty string', async(() => {
        component.defaultCountry = 'us';
        fixture.detectChanges();
        fixture.whenStable().then(() => {
          fixture.detectChanges();

          setInput(fixture.nativeElement, '1234', fixture, true);
          fixture.detectChanges();
          fixture.whenStable().then(() => {
            fixture.detectChanges();

            setInput(fixture.nativeElement, '', fixture, true);
            fixture.detectChanges();
            fixture.whenStable().then(() => {
              fixture.detectChanges();

              expect(nativeElement.querySelector('input').value).toBe('');

              expect(component.modelValue)
                .toBe('');

              expect(ngModel.valid).toBe(true);
              expect(ngModel.errors).toBeNull();
            });
          });
        });
      }));

      it('should handle invalid and then valid number', async(() => {
        component.defaultCountry = 'us';
        fixture.detectChanges();
        fixture.whenStable().then(() => {

          setInput(fixture.nativeElement, '1234', fixture, true);
          fixture.whenStable().then(() => {
            fixture.detectChanges();

            setInput(fixture.nativeElement, '8675555309', fixture, true);
            fixture.whenStable().then(() => {
              fixture.detectChanges();

              expect(nativeElement.querySelector('input').value).toBe('8675555309');

              expect(component.modelValue)
                .toEqual('(867) 555-5309');

              expect(ngModel.valid).toBe(true);
              expect(ngModel.errors).toBeNull();
            });
          });
        });
      }));

      it('should handle skyPhoneFieldNoValidate property', async(() => {
        component.noValidate = true;

        fixture.detectChanges();
        fixture.whenStable().then(() => {
          fixture.detectChanges();

          setInput(fixture.nativeElement, '1234', fixture, true);
          fixture.detectChanges();
          fixture.whenStable().then(() => {
            fixture.detectChanges();

            expect(nativeElement.querySelector('input').value).toBe('1234');

            expect(component.modelValue)
              .toBe('1234');

            expect(ngModel.valid).toBe(true);
            expect(ngModel.errors).toBeNull();
          });
        });
      }));
    });

    describe('disabled state', () => {

      it('should disable the input and dropdown when disable is set to true', () => {
        component.isDisabled = true;
        fixture.detectChanges();
        const countryInput = getCountrySearchToggleButton(fixture);

        expect(fixture.componentInstance.inputDirective.disabled).toBeTruthy();
        expect(fixture.debugElement.query(By.css('input')).nativeElement.disabled).toBeTruthy();
        expect(countryInput.disabled).toBeTruthy();
      });

      it('should not disable the input and dropdown when disable is set to false', () => {
        component.isDisabled = false;
        fixture.detectChanges();
        const countryInput = getCountrySearchToggleButton(fixture);

        expect(fixture.componentInstance.inputDirective.disabled).toBeFalsy();
        expect(fixture.debugElement.query(By.css('input')).nativeElement.disabled).toBeFalsy();
        expect(countryInput.disabled).toBeFalsy();
      });

    });

    describe('country selector', () => {

      it('should focus the country field when it is shown', fakeAsync(() => {
        fixture.detectChanges();
        const countryInput = getCountrySearchToggleButton(fixture);
        countryInput.click();
        detectChangesAndTick(fixture);

        expect(document.activeElement === nativeElement.querySelector('textarea'))
          .toBeTruthy();
      }));

      it('should be accessible when country search is shown', (done) => {
        fixture.detectChanges();
        const countryInput = getCountrySearchToggleButton(fixture);
        countryInput.click();

        fixture.detectChanges();
        fixture.whenStable().then(() => {

          fixture.detectChanges();
          fixture.whenStable().then(() => {
            expect(fixture.nativeElement).toBeAccessible();
            done();
          });
        });
      });

      it('should update the placeholder to the new country', fakeAsync(() => {
        fixture.detectChanges();
        let originalCountryData = component.phoneFieldComponent.countries.slice(0);

        setCountry('Canada', fixture);
        fixture.detectChanges();

        expect(nativeElement.querySelector('input').placeholder)
          .toBe(originalCountryData.find(country => country.name === 'Canada').exampleNumber);
      }));

      it('should revalidate after the country is changed', fakeAsync(() => {
        fixture.detectChanges();
        let inputElement = fixture.debugElement.query(By.css('input'));
        let ngModel = <NgModel>inputElement.injector.get(NgModel);

        component.defaultCountry = 'us';
        fixture.detectChanges();
        component.modelValue = '8675555309';
        detectChangesAndTick(fixture);

        expect(ngModel.valid).toBe(true);
        expect(ngModel.errors).toBeNull();

        setCountry('Albania', fixture);

        expect(ngModel.valid).toBe(false);
        expect(ngModel.errors).toEqual({
          'skyPhoneField': {
            invalid: '8675555309'
          }
        });
      }));

      it('should change to a new country based on a passed in dial code on a model change',
        fakeAsync(() => {
          fixture.detectChanges();
          let inputElement = fixture.debugElement.query(By.css('input'));
          let ngModel = <NgModel>inputElement.injector.get(NgModel);

          component.defaultCountry = 'us';
          fixture.detectChanges();
          component.modelValue = '8675555309';
          fixture.detectChanges();
          tick();
          fixture.detectChanges();
          tick();

          expect(ngModel.valid).toBe(true);
          expect(ngModel.errors).toBeNull();

          component.modelValue = '+3558675555309';
          fixture.detectChanges();
          tick();
          fixture.detectChanges();
          tick();

          expect(component.phoneFieldComponent.selectedCountry.iso2).toBe('al');
          expect(ngModel.valid).toBe(false);
          expect(ngModel.errors).toEqual({
            'skyPhoneField': {
              invalid: '+3558675555309'
            }
          });
        }));

      it('should change to a new country based on a passed in dial code on a input change',
        fakeAsync(() => {
          fixture.detectChanges();
          let inputElement = fixture.debugElement.query(By.css('input'));
          let ngModel = <NgModel>inputElement.injector.get(NgModel);

          component.defaultCountry = 'us';
          fixture.detectChanges();
          component.modelValue = '8675555309';
          detectChangesAndTick(fixture);

          expect(ngModel.valid).toBe(true);
          expect(ngModel.errors).toBeNull();

          setInput(nativeElement, '+3558675555309', fixture);
          detectChangesAndTick(fixture);

          expect(component.phoneFieldComponent.selectedCountry.iso2).toBe('al');
          expect(ngModel.valid).toBe(false);
          expect(ngModel.errors).toEqual({
            'skyPhoneField': {
              invalid: '+3558675555309'
            }
          });
        }));

      it('should not change to a new country when the dial code is not found',
        fakeAsync(() => {
          fixture.detectChanges();
          let inputElement = fixture.debugElement.query(By.css('input'));
          let ngModel = <NgModel>inputElement.injector.get(NgModel);

          component.defaultCountry = 'us';
          fixture.detectChanges();
          component.modelValue = '8675555309';
          fixture.detectChanges();
          tick();
          fixture.detectChanges();
          tick();

          expect(ngModel.valid).toBe(true);
          expect(ngModel.errors).toBeNull();

          setInput(nativeElement, '+1118675555309', fixture);
          fixture.detectChanges();
          tick();
          fixture.detectChanges();
          tick();

          expect(component.phoneFieldComponent.selectedCountry.iso2).toBe('us');
          expect(ngModel.valid).toBe(false);
          expect(ngModel.errors).toEqual({
            'skyPhoneField': {
              invalid: '+1118675555309'
            }
          });
        }));

      it('should change to a new country and not error when only the dial code is given',
        fakeAsync(() => {
          fixture.detectChanges();
          let inputElement = fixture.debugElement.query(By.css('input'));
          let ngModel = <NgModel>inputElement.injector.get(NgModel);

          component.defaultCountry = 'us';
          fixture.detectChanges();
          component.modelValue = '8675555309';
          fixture.detectChanges();
          tick();
          fixture.detectChanges();
          tick();

          expect(ngModel.valid).toBe(true);
          expect(ngModel.errors).toBeNull();

          setInput(nativeElement, '+61', fixture);
          fixture.detectChanges();
          tick();
          fixture.detectChanges();
          tick();

          expect(component.phoneFieldComponent.selectedCountry.iso2).toBe('au');
          expect(ngModel.valid).toBe(false);
          expect(ngModel.errors).toEqual({
            'skyPhoneField': {
              invalid: '+61'
            }
          });
        }));

      it('should validate correctly after country is changed', fakeAsync(() => {
        fixture.detectChanges();
        let inputElement = fixture.debugElement.query(By.css('input'));
        let ngModel = <NgModel>inputElement.injector.get(NgModel);

        component.defaultCountry = 'us';
        fixture.detectChanges();
        component.modelValue = '8675555309';
        detectChangesAndTick(fixture);

        expect(ngModel.valid).toBe(true);
        expect(ngModel.errors).toBeNull();

        setCountry('Albania', fixture);

        expect(ngModel.valid).toBe(false);
        expect(ngModel.errors).toEqual({
          'skyPhoneField': {
            invalid: '8675555309'
          }
        });

        component.modelValue = '024569874';
        detectChangesAndTick(fixture);

        expect(ngModel.valid).toBe(true);
        expect(ngModel.errors).toBeNull();
      }));

      it('should add the country code to non-default country data', fakeAsync(() => {
        fixture.detectChanges();
        let inputElement = fixture.debugElement.query(By.css('input'));
        let ngModel = <NgModel>inputElement.injector.get(NgModel);

        component.defaultCountry = 'us';
        fixture.detectChanges();
        fixture.detectChanges();
        tick();

        expect(ngModel.valid).toBe(true);
        expect(ngModel.errors).toBeNull();

        setCountry('Albania', fixture);

        component.modelValue = '024569874';
        detectChangesAndTick(fixture);

        expect(ngModel.value).toBe('+355 24 569 874');
        expect(ngModel.valid).toBe(true);
        expect(ngModel.errors).toBeNull();
      }));

    });

  });

  describe('reactive form', () => {
    let fixture: ComponentFixture<PhoneFieldReactiveTestComponent>;
    let component: PhoneFieldReactiveTestComponent;
    let nativeElement: HTMLElement;

    beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [
          PhoneFieldReactiveTestComponent
        ],
        imports: [
          SkyPhoneFieldModule,
          NoopAnimationsModule,
          FormsModule,
          ReactiveFormsModule
        ]
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

        expect(nativeElement.querySelector('input').placeholder)
          .toBe(component.phoneFieldComponent.countries
            .find(country => country.iso2 === 'us').exampleNumber);
      }));

      it('should initialize the default country correctly with capitalized code', fakeAsync(() => {
        component.defaultCountry = 'AU';
        detectChangesAndTick(fixture);

        expect(nativeElement.querySelector('input').placeholder)
          .toBe(component.phoneFieldComponent.countries
            .find(country => country.iso2 === 'au').exampleNumber);
      }));

      it('should initialize without a default country', fakeAsync(() => {
        detectChangesAndTick(fixture);

        expect(nativeElement.querySelector('input').placeholder)
          .toBe(component.phoneFieldComponent.countries.find(country => country.iso2 === 'us').exampleNumber);
      }));

      it('should initialize with a selected country', fakeAsync(() => {
        component.selectedCountry = {
          iso2: 'de',
          name: 'Germany'
        };
        detectChangesAndTick(fixture);

        expect(nativeElement.querySelector('input').placeholder)
          .toBe(component.phoneFieldComponent.countries.find(country => country.iso2 === 'de').exampleNumber);
      }));

      it('should handle initializing with number', fakeAsync(() => {
        component.initialValue = '8675555309';
        detectChangesAndTick(fixture);

        expect(nativeElement.querySelector('input').value).toBe('8675555309');
      }));

      it('should handle undefined initialization', fakeAsync(() => {
        detectChangesAndTick(fixture);

        expect(nativeElement.querySelector('input').value).toBe('');

        expect(nativeElement.querySelector('input')).not.toHaveCssClass('ng-invalid');
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

      it('should be accessible', (done) => {
        fixture.detectChanges();

        fixture.whenStable().then(() => {
          expect(fixture.nativeElement).toBeAccessible();
          done();
        });
      });

      it('should throw an error if directive is added in isolation', function () {
        try {
          component.showInvalidDirective = true;
          fixture.detectChanges();
        } catch (err) {
          expect(err.message).toContain('skyPhoneFieldInput');
        }
      });

    });

    describe('input change', () => {

      it('should handle input change with a string with the expected format', fakeAsync(() => {
        detectChangesAndTick(fixture);

        setInput(nativeElement, '8675555309', fixture);
        expect(nativeElement.querySelector('input').value).toBe('8675555309');
        expect(component.phoneControl.value).toEqual('(867) 555-5309');
      }));

      it('should handle input change with a string with the expected format after initially only haveing a change event', fakeAsync(() => {
        detectChangesAndTick(fixture);

        setInputChangeOnly(nativeElement, '5554564587', fixture);

        fixture.detectChanges();

        setInput(nativeElement, '8675555309', fixture);
        expect(nativeElement.querySelector('input').value).toBe('8675555309');
        expect(component.phoneControl.value).toEqual('(867) 555-5309');
      }));

      it('should handle input change with a string with the an unexpected format', fakeAsync(() => {
        detectChangesAndTick(fixture);

        setInput(nativeElement, '86755-5-309', fixture);
        expect(nativeElement.querySelector('input').value).toBe('86755-5-309');
        expect(component.phoneControl.value).toEqual('86755-5-309');
      }));

    });

    describe('model change', () => {

      it('should handle model change with a valid number', fakeAsync(() => {
        fixture.detectChanges();
        component.phoneControl.setValue('8675555309');
        detectChangesAndTick(fixture);

        expect(nativeElement.querySelector('input').value).toBe('8675555309');
      }));

    });

    describe('formatting', () => {

      it('should correctly format a number on the default country when no return format is given', fakeAsync(() => {
        detectChangesAndTick(fixture);

        setInput(nativeElement, '8675555309', fixture);
        expect(nativeElement.querySelector('input').value).toBe('8675555309');
        expect(component.phoneControl.value).toEqual('(867) 555-5309');
      }));

      it('should correctly format a number on a non-default country when no return format is given', fakeAsync(() => {
        component.selectedCountry = {
          iso2: 'au',
          name: 'Australia'
        };
        detectChangesAndTick(fixture);

        setInput(nativeElement, '0212345678', fixture);
        expect(nativeElement.querySelector('input').value).toBe('0212345678');
        expect(component.phoneControl.value).toEqual('+61 2 1234 5678');
      }));

      it('should correctly format a number on the default country when the default return format is given', fakeAsync(() => {
        component.returnFormat = 'default';
        detectChangesAndTick(fixture);

        setInput(nativeElement, '8675555309', fixture);
        expect(nativeElement.querySelector('input').value).toBe('8675555309');
        expect(component.phoneControl.value).toEqual('(867) 555-5309');
      }));

      it('should correctly format a number on a non-default country when the default return format is given', fakeAsync(() => {
        component.returnFormat = 'default';
        component.selectedCountry = {
          iso2: 'au',
          name: 'Australia'
        };
        detectChangesAndTick(fixture);

        setInput(nativeElement, '0212345678', fixture);
        expect(nativeElement.querySelector('input').value).toBe('0212345678');
        expect(component.phoneControl.value).toEqual('+61 2 1234 5678');
      }));

      it('should correctly format a number on the default country when the national return format is given', fakeAsync(() => {
        component.returnFormat = 'national';
        detectChangesAndTick(fixture);

        setInput(nativeElement, '8675555309', fixture);
        expect(nativeElement.querySelector('input').value).toBe('8675555309');
        expect(component.phoneControl.value).toEqual('(867) 555-5309');
      }));

      it('should correctly format a number on a non-default country when the national return format is given', fakeAsync(() => {
        component.returnFormat = 'national';
        component.selectedCountry = {
          iso2: 'au',
          name: 'Australia'
        };
        detectChangesAndTick(fixture);

        setInput(nativeElement, '0212345678', fixture);
        expect(nativeElement.querySelector('input').value).toBe('0212345678');
        expect(component.phoneControl.value).toEqual('(02) 1234 5678');
      }));

      it('should correctly format a number on the default country when the national return format is given', fakeAsync(() => {
        component.returnFormat = 'international';
        detectChangesAndTick(fixture);

        setInput(nativeElement, '8675555309', fixture);
        expect(nativeElement.querySelector('input').value).toBe('8675555309');
        expect(component.phoneControl.value).toEqual('+1 867-555-5309');
      }));

      it('should correctly format a number on a non-default country when the national return format is given', fakeAsync(() => {
        component.returnFormat = 'international';
        component.selectedCountry = {
          iso2: 'au',
          name: 'Australia'
        };
        detectChangesAndTick(fixture);

        setInput(nativeElement, '0212345678', fixture);
        expect(nativeElement.querySelector('input').value).toBe('0212345678');
        expect(component.phoneControl.value).toEqual('+61 2 1234 5678');
      }));

    });

    describe('validation', () => {

      it('should validate properly when invalid number is passed through input change',
        fakeAsync(() => {
          component.defaultCountry = 'us';
          fixture.detectChanges();
          tick();
          setInput(nativeElement, '123', fixture);
          fixture.detectChanges();

          expect(nativeElement.querySelector('input').value).toBe('123');

          expect(component.phoneControl.value)
            .toBe('123');

          expect(component.phoneControl.valid).toBe(false);

          expect(component.phoneControl.errors).toEqual({
            'skyPhoneField': {
              invalid: '123'
            }
          });

          expect(component.phoneControl.pristine).toBe(false);
          expect(component.phoneControl.touched).toBe(true);

        }));

      it('should validate properly when invalid number on initialization', fakeAsync(() => {
        component.initialValue = '1234';
        component.defaultCountry = 'us';
        detectChangesAndTick(fixture);

        expect(nativeElement.querySelector('input').value).toBe('1234');

        expect(component.phoneControl.value)
          .toBe('1234');

        expect(component.phoneControl.valid).toBe(false);

        expect(component.phoneControl.errors).toEqual({
          'skyPhoneField': {
            invalid: '1234'
          }
        });

        expect(component.phoneControl.touched).toBe(true);

        blurInput(fixture.nativeElement, fixture);
        expect(component.phoneControl.valid).toBe(false);

        expect(component.phoneControl.errors).toEqual({
          'skyPhoneField': {
            invalid: '1234'
          }
        });

        expect(component.phoneControl.touched).toBe(true);
      }));

      it('should validate properly when invalid number format on initialization', fakeAsync(() => {
        component.initialValue = '867-555-530';
        component.defaultCountry = 'us';
        detectChangesAndTick(fixture);

        expect(nativeElement.querySelector('input').value).toBe('867-555-530');

        expect(component.phoneControl.value)
          .toBe('867-555-530');

        expect(component.phoneControl.valid).toBe(false);

        expect(component.phoneControl.errors).toEqual({
          'skyPhoneField': {
            invalid: '867-555-530'
          }
        });

        expect(component.phoneControl.touched).toBe(true);

        blurInput(fixture.nativeElement, fixture);
        expect(component.phoneControl.valid).toBe(false);

        expect(component.phoneControl.errors).toEqual({
          'skyPhoneField': {
            invalid: '867-555-530'
          }
        });

        expect(component.phoneControl.touched).toBe(true);
      }));

      it('should validate properly when valid number format on initialization', fakeAsync(() => {
        component.initialValue = '867-555-5309';
        component.defaultCountry = 'us';
        detectChangesAndTick(fixture);

        expect(nativeElement.querySelector('input').value).toBe('867-555-5309');

        expect(component.phoneControl.value)
          .toBe('(867) 555-5309');

        expect(component.phoneControl.valid).toBe(true);
        expect(component.phoneControl.errors).toBeNull();

        expect(component.phoneControl.touched).toBe(false);

        blurInput(fixture.nativeElement, fixture);
        expect(component.phoneControl.valid).toBe(true);
        expect(component.phoneControl.errors).toBeNull();
        expect(component.phoneControl.touched).toBe(true);
      }));

      it('should validate properly when invalid number on model change', fakeAsync(() => {
        component.defaultCountry = 'us';
        detectChangesAndTick(fixture);

        component.phoneControl.setValue('1234');

        detectChangesAndTick(fixture);

        expect(nativeElement.querySelector('input').value).toBe('1234');

        expect(component.phoneControl.value)
          .toBe('1234');

        expect(component.phoneControl.valid).toBe(false);

        expect(component.phoneControl.errors).toEqual({
          'skyPhoneField': {
            invalid: '1234'
          }
        });

      }));

      it('should validate properly when input changed to empty string', fakeAsync(() => {
        component.defaultCountry = 'us';
        detectChangesAndTick(fixture);

        setInput(fixture.nativeElement, '1234', fixture);

        setInput(fixture.nativeElement, '', fixture);

        expect(nativeElement.querySelector('input').value).toBe('');

        expect(component.phoneControl.value)
          .toBe('');

        expect(component.phoneControl.valid).toBe(true);
        expect(component.phoneControl.errors).toBeNull();
      }));

      it('should handle invalid and then valid number', fakeAsync(() => {
        component.defaultCountry = 'us';
        detectChangesAndTick(fixture);

        setInput(fixture.nativeElement, '1234', fixture);

        setInput(fixture.nativeElement, '8675555309', fixture);

        detectChangesAndTick(fixture);

        expect(nativeElement.querySelector('input').value).toBe('8675555309');

        expect(component.phoneControl.value)
          .toEqual('(867) 555-5309');

        expect(component.phoneControl.valid).toBe(true);
        expect(component.phoneControl.errors).toBeNull();
      }));

      it('should handle noValidate property', fakeAsync(() => {
        component.noValidate = true;

        detectChangesAndTick(fixture);

        setInput(fixture.nativeElement, '1234', fixture);

        detectChangesAndTick(fixture);

        expect(nativeElement.querySelector('input').value).toBe('1234');

        expect(component.phoneControl.value)
          .toBe('1234');

        expect(component.phoneControl.valid).toBe(true);
        expect(component.phoneControl.errors).toBeNull();
      }));
    });

    describe('disabled state', () => {

      it('should disable the input and dropdown when disable is set to true', fakeAsync(() => {
        fixture.detectChanges();
        component.phoneControl.disable();
        detectChangesAndTick(fixture);
        const countryInput = getCountrySearchToggleButton(fixture);

        expect(fixture.componentInstance.inputDirective.disabled).toBeTruthy();
        expect(fixture.debugElement.query(By.css('input')).nativeElement.disabled).toBeTruthy();
        expect(countryInput.disabled).toBeTruthy();
      }));

      it('should not disable the input and dropdown when disable is set to false', fakeAsync(() => {
        fixture.detectChanges();
        component.phoneControl.enable();
        detectChangesAndTick(fixture);
        const countryInput = getCountrySearchToggleButton(fixture);

        expect(fixture.componentInstance.inputDirective.disabled).toBeFalsy();
        expect(fixture.debugElement.query(By.css('input')).nativeElement.disabled).toBeFalsy();
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

      it('should be accessible when country search is shown', (done) => {
        fixture.detectChanges();
        const countryInput = getCountrySearchToggleButton(fixture);
        countryInput.click();

        fixture.detectChanges();
        fixture.whenStable().then(() => {

          fixture.detectChanges();
          fixture.whenStable().then(() => {
            expect(fixture.nativeElement).toBeAccessible();
            done();
          });
        });
      });

      it('should update the placeholder to the new country', fakeAsync(() => {
        fixture.detectChanges();
        let originalCountryData = component.phoneFieldComponent.countries.slice(0);

        setCountry('Canada', fixture);

        expect(nativeElement.querySelector('input').placeholder)
          .toBe(originalCountryData.find(country => country.name === 'Canada').exampleNumber);
      }));

      it('should revalidate after the country is changed', fakeAsync(() => {
        fixture.detectChanges();
        component.defaultCountry = 'us';
        fixture.detectChanges();
        component.phoneControl.setValue('8675555309');
        detectChangesAndTick(fixture);

        expect(component.phoneControl.valid).toBe(true);
        expect(component.phoneControl.errors).toBeNull();

        setCountry('Albania', fixture);

        expect(component.phoneControl.valid).toBe(false);
        expect(component.phoneControl.errors).toEqual({
          'skyPhoneField': {
            invalid: '8675555309'
          }
        });
      }));

      it('should change to a new country based on a passed in dial code on a model change',
        fakeAsync(() => {
          fixture.detectChanges();
          component.defaultCountry = 'us';
          fixture.detectChanges();
          component.phoneControl.setValue('8675555309');
          fixture.detectChanges();
          tick();
          fixture.detectChanges();
          tick();

          expect(component.phoneControl.valid).toBe(true);
          expect(component.phoneControl.errors).toBeNull();

          component.phoneControl.setValue('+3558675555309');
          fixture.detectChanges();
          tick();
          fixture.detectChanges();
          tick();

          expect(component.phoneFieldComponent.selectedCountry.iso2).toBe('al');
          expect(component.phoneControl.valid).toBe(false);
          expect(component.phoneControl.errors).toEqual({
            'skyPhoneField': {
              invalid: '+3558675555309'
            }
          });
        }));

      it('should change to a new country based on a passed in dial code on a input change',
        fakeAsync(() => {
          fixture.detectChanges();
          component.defaultCountry = 'us';
          fixture.detectChanges();
          component.phoneControl.setValue('8675555309');
          fixture.detectChanges();
          tick();
          fixture.detectChanges();
          tick();

          expect(component.phoneControl.valid).toBe(true);
          expect(component.phoneControl.errors).toBeNull();

          setInput(nativeElement, '+3558675555309', fixture);
          fixture.detectChanges();
          tick();
          fixture.detectChanges();
          tick();

          expect(component.phoneFieldComponent.selectedCountry.iso2).toBe('al');
          expect(component.phoneControl.valid).toBe(false);
          expect(component.phoneControl.errors).toEqual({
            'skyPhoneField': {
              invalid: '+3558675555309'
            }
          });
        }));

      it('should not change to a new country when the dial code is not found',
        fakeAsync(() => {
          fixture.detectChanges();
          component.defaultCountry = 'us';
          fixture.detectChanges();
          component.phoneControl.setValue('8675555309');
          fixture.detectChanges();
          tick();
          fixture.detectChanges();
          tick();

          expect(component.phoneControl.valid).toBe(true);
          expect(component.phoneControl.errors).toBeNull();

          setInput(nativeElement, '+1118675555309', fixture);
          detectChangesAndTick(fixture);

          expect(component.phoneFieldComponent.selectedCountry.iso2).toBe('us');
          expect(component.phoneControl.valid).toBe(false);
          expect(component.phoneControl.errors).toEqual({
            'skyPhoneField': {
              invalid: '+1118675555309'
            }
          });
        }));

      it('should change to a new country and not error when only the dial code is given',
        fakeAsync(() => {
          fixture.detectChanges();

          component.defaultCountry = 'us';
          fixture.detectChanges();
          component.phoneControl.setValue('8675555309');
          fixture.detectChanges();
          tick();
          fixture.detectChanges();
          tick();

          expect(component.phoneControl.valid).toBe(true);
          expect(component.phoneControl.errors).toBeNull();

          setInput(nativeElement, '+61', fixture);
          detectChangesAndTick(fixture);

          expect(component.phoneFieldComponent.selectedCountry.iso2).toBe('au');
          expect(component.phoneControl.valid).toBe(false);
          expect(component.phoneControl.errors).toEqual({
            'skyPhoneField': {
              invalid: '+61'
            }
          });
        }));

      it('should validate correctly after country is changed', fakeAsync(() => {
        fixture.detectChanges();
        component.defaultCountry = 'us';
        fixture.detectChanges();
        component.phoneControl.setValue('8675555309');
        detectChangesAndTick(fixture);

        expect(component.phoneControl.valid).toBe(true);
        expect(component.phoneControl.errors).toBeNull();

        setCountry('Albania', fixture);

        expect(component.phoneControl.valid).toBe(false);
        expect(component.phoneControl.errors).toEqual({
          'skyPhoneField': {
            invalid: '8675555309'
          }
        });

        component.phoneControl.setValue('024569874');
        detectChangesAndTick(fixture);

        expect(component.phoneControl.valid).toBe(true);
        expect(component.phoneControl.errors).toBeNull();
      }));

      it('should add the country code to non-default country data', fakeAsync(() => {
        fixture.detectChanges();
        component.defaultCountry = 'us';
        detectChangesAndTick(fixture);

        setCountry('Albania', fixture);

        component.phoneControl.setValue('024569874');
        detectChangesAndTick(fixture);

        expect(component.phoneControl.value).toBe('+355 24 569 874');
        expect(component.phoneControl.valid).toBe(true);
        expect(component.phoneControl.errors).toBeNull();
      }));

    });

  });

});
