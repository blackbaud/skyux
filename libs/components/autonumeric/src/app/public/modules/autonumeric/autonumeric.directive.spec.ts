import {
  async,
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick
} from '@angular/core/testing';

import {
  Validators
} from '@angular/forms';

import {
  expect,
  SkyAppTestUtility
} from '@skyux-sdk/testing';

import {
  AutonumericFixtureComponent,
  AutonumericFixtureModule,
  AutonumericFixtureOptionsProvider
} from './fixtures';

import {
  SkyAutonumericOptions
} from './autonumeric-options';

import {
  SkyAutonumericOptionsProvider
} from './autonumeric-options-provider';

describe('Autonumeric directive', () => {

  let fixture: ComponentFixture<AutonumericFixtureComponent>;

  // #region helpers
  function detectChanges(): void {
    fixture.detectChanges();
    tick();
  }

  function getReactiveInput(): HTMLInputElement {
    return fixture.nativeElement.querySelector('#donationAmount') as HTMLInputElement;
  }

  function setValue(value: number): void {
    fixture.componentInstance.formGroup.get('donationAmount').setValue(value);
    fixture.componentInstance.templateDrivenModel.donationAmount = value;
  }

  function setOptions(options: SkyAutonumericOptions): void {
    fixture.componentInstance.autonumericOptions = options;
  }

  function getFormattedValue(): string {
    const reactiveValue = fixture.nativeElement.querySelector('.app-reactive-form-input').value;
    const templateDrivenValue = fixture.nativeElement.querySelector('.app-template-driven-input').value;

    if (reactiveValue !== templateDrivenValue) {
      fail(`The reactive and template-driven forms's formatted values do not match! ('${reactiveValue}' versus '${templateDrivenValue}')`);
    }

    return reactiveValue;
  }

  function getModelValue(): number {
    const reactiveValue = fixture.componentInstance.formControl.value;
    const templateDrivenValue = fixture.componentInstance.donationAmountTemplateDriven.value;

    if (reactiveValue !== templateDrivenValue) {
      fail(`The reactive and template-driven forms's model values do not match! ('${reactiveValue}' versus '${templateDrivenValue}')`);
    }

    return reactiveValue;
  }

  function triggerBlur(): void {
    SkyAppTestUtility.fireDomEvent(fixture.nativeElement.querySelector('.app-reactive-form-input'), 'blur');
    SkyAppTestUtility.fireDomEvent(fixture.nativeElement.querySelector('.app-template-driven-input'), 'blur');
  }

  function triggerKeyUp(): void {
    SkyAppTestUtility.fireDomEvent(fixture.nativeElement.querySelector('.app-reactive-form-input'), 'keyup');
    SkyAppTestUtility.fireDomEvent(fixture.nativeElement.querySelector('.app-template-driven-input'), 'keyup');
  }

  /**
   * Checks both the reactive and template-driven controls against various statuses.
   * @param statuses A set of Angular NgModel statuses to check against (e.g., pristine, touched, valid).
   */
  function verifyFormControlStatuses(
    statuses: {
      [_: string]: boolean;
    }
  ): void {
    const control: any = fixture.componentInstance.formControl;
    const model: any = fixture.componentInstance.donationAmountTemplateDriven;

    Object.keys(statuses).forEach((status) => {
      expect(control[status]).toEqual(statuses[status]);
      expect(model[status]).toEqual(statuses[status]);
    });
  }
  // #endregion

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        AutonumericFixtureModule
      ]
    });

    fixture = TestBed.createComponent(AutonumericFixtureComponent);
  });

  afterEach(() => {
    fixture.destroy();
  });

  it('should use default configuration', fakeAsync(() => {
    detectChanges();

    setValue(1000);

    detectChanges();

    const modelValue = getModelValue();
    const formattedValue = getFormattedValue();

    expect(modelValue).toEqual(1000);
    expect(formattedValue).toEqual('1,000.00');
  }));

  it('should properly format 0 values', fakeAsync(() => {
    detectChanges();

    setValue(0);

    detectChanges();

    const modelValue = getModelValue();
    const formattedValue = getFormattedValue();

    expect(modelValue).toEqual(0);
    expect(formattedValue).toEqual('0.00');
  }));

  it('should support preset configuration', fakeAsync(() => {
    setOptions('dollar');

    detectChanges();

    setValue(1000);

    detectChanges();

    const modelValue = getModelValue();
    const formattedValue = getFormattedValue();

    expect(modelValue).toEqual(1000);
    expect(formattedValue).toEqual('$1,000.00');
  }));

  it('should support custom configuration', fakeAsync(() => {
    setOptions({
      decimalPlaces: 5
    });

    detectChanges();

    setValue(1000);

    detectChanges();

    const modelValue = getModelValue();
    const formattedValue = getFormattedValue();

    expect(modelValue).toEqual(1000);
    expect(formattedValue).toEqual('1,000.00000');
  }));

  it('should update numeric value on blur', fakeAsync(() => {
    detectChanges();

    const autonumericInstance = fixture.componentInstance.autonumericDirective['autonumericInstance'];
    const spy = spyOn(autonumericInstance, 'getNumber').and.callThrough();

    const input = fixture.nativeElement.querySelector('input');

    input.value = '1000';
    SkyAppTestUtility.fireDomEvent(input, 'input');
    SkyAppTestUtility.fireDomEvent(input, 'blur');
    detectChanges();

    expect(spy).toHaveBeenCalled();
  }));

  it('should not update numeric value on blur when no change is made', fakeAsync(() => {
    detectChanges();

    const autonumericInstance = fixture.componentInstance.autonumericDirective['autonumericInstance'];
    const spy = spyOn(autonumericInstance, 'getNumber').and.callThrough();

    const input = fixture.nativeElement.querySelector('input');

    SkyAppTestUtility.fireDomEvent(input, 'mouseenter');
    SkyAppTestUtility.fireDomEvent(input, 'input');
    SkyAppTestUtility.fireDomEvent(input, 'blur');
    detectChanges();

    expect(spy).not.toHaveBeenCalled();
  }));

  it('should not update numeric value on blur when no change is made and a currency symbol is specified', fakeAsync(() => {
    setOptions('dollar');

    detectChanges();

    const autonumericInstance = fixture.componentInstance.autonumericDirective['autonumericInstance'];
    const spy = spyOn(autonumericInstance, 'getNumber').and.callThrough();

    const input = fixture.nativeElement.querySelector('input');

    SkyAppTestUtility.fireDomEvent(input, 'mouseenter');
    SkyAppTestUtility.fireDomEvent(input, 'input');
    SkyAppTestUtility.fireDomEvent(input, 'blur');
    detectChanges();

    expect(spy).not.toHaveBeenCalled();
  }));

  it('should not notify identical value changes', fakeAsync(() => {
    detectChanges();

    const spy = spyOn(fixture.componentInstance.autonumericDirective as any, 'onChange').and.callThrough();

    setValue(1000);
    detectChanges();

    expect(spy).toHaveBeenCalled();

    spy.calls.reset();
    setValue(1000);
    detectChanges();

    expect(spy).not.toHaveBeenCalled();
  }));

  it('should be accessible', async(() => {
    fixture.detectChanges();

    setValue(1000);

    fixture.detectChanges();

    fixture.whenStable().then(() => {
      expect(fixture.nativeElement).toBeAccessible();
    });
  }));

  describe('global configuration', () => {

    beforeEach(() => {
      TestBed.resetTestingModule();

      TestBed.configureTestingModule({
        imports: [
          AutonumericFixtureModule
        ],
        providers: [
          {
            provide: SkyAutonumericOptionsProvider,
            useClass: AutonumericFixtureOptionsProvider
          }
        ]
      });

      fixture = TestBed.createComponent(AutonumericFixtureComponent);
    });

    it('should support global configuration', fakeAsync(() => {
      detectChanges();

      setValue(1000);

      detectChanges();

      const modelValue = getModelValue();
      const formattedValue = getFormattedValue();

      expect(modelValue).toEqual(1000);
      expect(formattedValue).toEqual('%1,000.00000');
    }));

    it('should overwrite global configuration with configuration from the input', fakeAsync(() => {
      setOptions('dollar');

      detectChanges();

      setValue(1000);

      detectChanges();

      const modelValue = getModelValue();
      const formattedValue = getFormattedValue();

      expect(modelValue).toEqual(1000);
      expect(formattedValue).toEqual('$1,000.00000');
    }));
  });

  describe('Angular form control statuses', () => {

    it('should set correct statuses when initialized without value', fakeAsync(() => {
      detectChanges();

      verifyFormControlStatuses({
        pristine: true,
        touched: false,
        valid: true
      });
    }));

    it('should set correct statuses when initialized with a value', fakeAsync(() => {
      detectChanges();

      setValue(1000);

      detectChanges();

      verifyFormControlStatuses({
        pristine: true,
        touched: false,
        valid: true
      });
    }));

    it('should mark the control as touched on blur', fakeAsync(() => {
      detectChanges();

      verifyFormControlStatuses({
        touched: false
      });

      triggerBlur();

      detectChanges();

      verifyFormControlStatuses({
        touched: true
      });
    }));

    it('should mark the control as invalid on blur if the field is required and the value is undefined', fakeAsync(() => {
      detectChanges();
      fixture.componentInstance.formControl.setValidators([Validators.required]);
      fixture.componentInstance.required = true;
      detectChanges();

      verifyFormControlStatuses({
        valid: true
      });

      const inputs = fixture.nativeElement.querySelectorAll('input');
      for (let i = 0; i < inputs.length; i++) {
        inputs[i].value = '';
        SkyAppTestUtility.fireDomEvent(inputs[i], 'input');
        SkyAppTestUtility.fireDomEvent(inputs[i], 'blur');
      }
      detectChanges();

      verifyFormControlStatuses({
        valid: false
      });
    }));

    it('should mark the control as invalid if given a non-numerical value', fakeAsync(() => {
      detectChanges();

      verifyFormControlStatuses({
        valid: true
      });

      fixture.componentInstance.formGroup.get('donationAmount').setValue('foo');
      fixture.componentInstance.templateDrivenModel.donationAmount = 'foo';
      detectChanges();

      verifyFormControlStatuses({
        valid: false
      });
    }));

    it('should mark the control as dirty on keyup', fakeAsync(() => {
      detectChanges();

      verifyFormControlStatuses({
        dirty: false
      });

      triggerKeyUp();

      detectChanges();

      verifyFormControlStatuses({
        dirty: true
      });
    }));

    it('should disable the form when the form control disabled() method is called', fakeAsync(() => {
      detectChanges();
      const formControl = fixture.componentInstance.formGroup.get('donationAmount');
      const input = getReactiveInput();

      // Disable the form via form control.
      formControl.disable();
      detectChanges();

      // Expect both the input element and form control to be disabled.
      expect(input.disabled).toEqual(true);
      expect(formControl.disabled).toEqual(true);

      // Enable the form via form control.
      formControl.enable();
      detectChanges();

      // Expect both the input element and form control to be enabled.
      expect(input.disabled).toEqual(false);
      expect(formControl.disabled).toEqual(false);
    }));

  });

});
