import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from '@angular/core/testing';
import { AbstractControl, NgModel, Validators } from '@angular/forms';
import { SkyAppTestUtility, expect, expectAsync } from '@skyux-sdk/testing';

import { SkyAutonumericOptions } from './autonumeric-options';
import { SkyAutonumericOptionsProvider } from './autonumeric-options-provider';
import { SkyAutonumericDirective } from './autonumeric.directive';
import { AutonumericFixtureOptionsProvider } from './fixtures/autonumeric-options-provider.fixture';
import { AutonumericFixtureComponent } from './fixtures/autonumeric.component.fixture';
import { AutonumericFixtureModule } from './fixtures/autonumeric.module.fixture';

describe('Autonumeric directive', () => {
  let fixture: ComponentFixture<AutonumericFixtureComponent>;

  // #region helpers
  function detectChangesTick(): void {
    fixture.detectChanges();
    tick();
  }

  function getReactiveInput(): HTMLInputElement {
    return fixture.nativeElement.querySelector(
      '#donationAmount',
    ) as HTMLInputElement;
  }

  function setValue(value: number | string): void {
    fixture.componentInstance.formControl.setValue(value);
    fixture.componentInstance.templateDrivenDonationAmount = value;
    detectChangesTick();
  }

  function setOptions(options: SkyAutonumericOptions): void {
    fixture.componentInstance.autonumericOptions = options;
    detectChangesTick();
  }

  function setUnformatted(): void {
    fixture.componentInstance.setUnformatted = true;
    detectChangesTick();
  }

  function getFormattedValue(): string {
    const reactiveValue = fixture.nativeElement.querySelector(
      '.app-reactive-form-input',
    ).value;
    const templateDrivenValue = fixture.nativeElement.querySelector(
      '.app-template-driven-input',
    ).value;

    if (reactiveValue !== templateDrivenValue) {
      fail(
        `The reactive and template-driven forms's formatted values do not match! ('${reactiveValue}' versus '${templateDrivenValue}')`,
      );
    }

    return reactiveValue;
  }

  function getModelValue(): number {
    const reactiveValue = fixture.componentInstance.formControl.value;
    const templateDrivenValue = fixture.componentInstance.templateNgModel.value;

    if (reactiveValue !== templateDrivenValue) {
      fail(
        `The reactive and template-driven forms's model values do not match! ('${reactiveValue}' versus '${templateDrivenValue}')`,
      );
    }

    return reactiveValue;
  }

  function triggerBlur(): void {
    SkyAppTestUtility.fireDomEvent(
      fixture.nativeElement.querySelector('.app-reactive-form-input'),
      'blur',
    );
    SkyAppTestUtility.fireDomEvent(
      fixture.nativeElement.querySelector('.app-template-driven-input'),
      'blur',
    );
  }

  function triggerInput(): void {
    SkyAppTestUtility.fireDomEvent(
      fixture.nativeElement.querySelector('.app-reactive-form-input'),
      'input',
    );
    SkyAppTestUtility.fireDomEvent(
      fixture.nativeElement.querySelector('.app-template-driven-input'),
      'input',
    );
  }

  /**
   * Checks both the reactive and template-driven controls against various statuses.
   * @param statuses A set of Angular NgModel statuses to check against (e.g., pristine, touched, valid).
   */
  function verifyFormControlStatuses(statuses: Record<string, boolean>): void {
    const control = fixture.componentInstance.formControl;
    const ngModel = fixture.componentInstance.templateNgModel;

    Object.keys(statuses).forEach((status) => {
      expect(control[status as keyof AbstractControl])
        .withContext('REACTIVE form - ' + status.toUpperCase())
        .toEqual(statuses[status]);
      expect(ngModel[status as keyof NgModel])
        .withContext('TEMPLATE form - ' + status.toUpperCase())
        .toEqual(statuses[status]);
    });
  }
  // #endregion

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AutonumericFixtureModule],
    });

    fixture = TestBed.createComponent(AutonumericFixtureComponent);
  });

  afterEach(() => {
    fixture.destroy();
  });

  it('should use default configuration', fakeAsync(() => {
    setValue(1000);

    const modelValue = getModelValue();
    const formattedValue = getFormattedValue();

    expect(modelValue).toEqual(1000);
    expect(formattedValue).toEqual('1,000.00');
  }));

  it('should destroy autoNumeric instance on completion', fakeAsync(() => {
    setValue(1000);
    const reactiveInput: HTMLInputElement = fixture.nativeElement.querySelector(
      '.app-reactive-form-input',
    );
    const templateDrivenInput: HTMLInputElement =
      fixture.nativeElement.querySelector('.app-template-driven-input');

    expect(
      (window as any).autoNumericGlobalList.get(reactiveInput),
    ).toBeDefined();
    expect(
      (window as any).autoNumericGlobalList.get(templateDrivenInput),
    ).toBeDefined();
    fixture.destroy();
    expect(
      (window as any).autoNumericGlobalList.get(reactiveInput),
    ).toBeUndefined();
    expect(
      (window as any).autoNumericGlobalList.get(templateDrivenInput),
    ).toBeUndefined();
  }));

  it('should properly format 0 values', fakeAsync(() => {
    setValue(0);

    const modelValue = getModelValue();
    const formattedValue = getFormattedValue();

    expect(modelValue).toEqual(0);
    expect(formattedValue).toEqual('0.00');
  }));

  it('should support preset configuration', fakeAsync(() => {
    setOptions('dollar');

    setValue(1000);

    const modelValue = getModelValue();
    const formattedValue = getFormattedValue();

    expect(modelValue).toEqual(1000);
    expect(formattedValue).toEqual('$1,000.00');
  }));

  it('should support setting the value unformatted', fakeAsync(() => {
    setOptions('dollar');

    setUnformatted();

    setValue(2000);

    const modelValue = getModelValue();
    const formattedValue = getFormattedValue();

    expect(modelValue).toEqual(2000);
    expect(formattedValue).toEqual('2000');
  }));

  it('should support custom configuration', fakeAsync(() => {
    setOptions({
      decimalPlaces: 5,
    });

    setValue(1000);

    const modelValue = getModelValue();
    const formattedValue = getFormattedValue();

    expect(modelValue).toEqual(1000);
    expect(formattedValue).toEqual('1,000.00000');
  }));

  it('should support negativeBracketsTypeOnBlur', fakeAsync(() => {
    setOptions({
      currencySymbol: '$',
      decimalPlaces: 2,
      negativeBracketsTypeOnBlur: '(,)',
    });

    setValue(1000);

    const modelValue = getModelValue();
    const formattedValue = getFormattedValue();

    expect(modelValue).toEqual(1000);
    expect(formattedValue).toEqual('$1,000.00');
  }));

  it('should update numeric value on keyup', fakeAsync(() => {
    detectChangesTick();

    const input = fixture.nativeElement.querySelector('input');

    input.value = '1000';
    SkyAppTestUtility.fireDomEvent(input, 'input');
    SkyAppTestUtility.fireDomEvent(input, 'keyup');
    detectChangesTick();

    expect(input.value).toEqual('1,000');
  }));

  it('should not update numeric value on keyup when no change is made', fakeAsync(() => {
    const input = fixture.nativeElement.querySelector('input');

    SkyAppTestUtility.fireDomEvent(input, 'mouseenter');
    SkyAppTestUtility.fireDomEvent(input, 'input');
    SkyAppTestUtility.fireDomEvent(input, 'keyup');

    expect(fixture.componentInstance.formControl.value).toBeFalsy();

    setOptions('dollar');

    SkyAppTestUtility.fireDomEvent(input, 'mouseenter');
    SkyAppTestUtility.fireDomEvent(input, 'input');
    SkyAppTestUtility.fireDomEvent(input, 'keyup');

    expect(fixture.componentInstance.formControl.value).toBeFalsy();
  }));

  it('should be accessible', async () => {
    fixture.detectChanges();
    await fixture.whenStable();

    fixture.componentInstance.formControl.setValue(1000);
    fixture.componentInstance.templateDrivenDonationAmount = 1000;

    fixture.detectChanges();

    await expectAsync(fixture.nativeElement).toBeAccessible();
  });

  it('should handle autoNumeric:rawValueModified event for Android Chrome workaround', fakeAsync(() => {
    detectChangesTick();

    const input = fixture.nativeElement.querySelector('input');

    // Set value programmatically first to ensure we have a baseline
    setValue(1000);
    expect(fixture.componentInstance.formControl.value).toEqual(1000);

    // Simulate user interaction - set the input value directly and fire input event
    input.value = '2500';
    SkyAppTestUtility.fireDomEvent(input, 'input');
    detectChangesTick();

    // Verify the input event updated the value
    const valueAfterInput = fixture.componentInstance.formControl.value;

    // Now fire the autoNumeric:rawValueModified event
    // This simulates the Android Chrome behavior where this event provides
    // the correct value when the input event lags behind
    SkyAppTestUtility.fireDomEvent(input, 'autoNumeric:rawValueModified');
    detectChangesTick();

    // The value should be updated (even if input event didn't catch it)
    expect(fixture.componentInstance.formControl.value).toEqual(
      valueAfterInput,
    );
  }));

  describe('global configuration', () => {
    beforeEach(() => {
      TestBed.resetTestingModule();

      TestBed.configureTestingModule({
        imports: [AutonumericFixtureModule],
        providers: [
          {
            provide: SkyAutonumericOptionsProvider,
            useClass: AutonumericFixtureOptionsProvider,
          },
        ],
      });

      fixture = TestBed.createComponent(AutonumericFixtureComponent);
    });

    it('should support global configuration', fakeAsync(() => {
      setValue(1000);

      const modelValue = getModelValue();
      const formattedValue = getFormattedValue();

      expect(modelValue).toEqual(1000);
      expect(formattedValue).toEqual('%1,000.00000');
    }));

    it('should support global configuration when the local configuration setter is not called', fakeAsync(() => {
      spyOnProperty(
        SkyAutonumericDirective.prototype,
        'skyAutonumeric',
        'set',
      ).and.stub();

      setValue(1000);

      const modelValue = getModelValue();
      const formattedValue = getFormattedValue();

      expect(modelValue).toEqual(1000);
      expect(formattedValue).toEqual('%1,000.00000');
    }));

    it('should support global configuration when the local configuration is set to undefined', fakeAsync(() => {
      fixture.componentInstance.autonumericOptions = undefined;
      detectChangesTick();

      setValue(1000);

      const modelValue = getModelValue();
      const formattedValue = getFormattedValue();

      expect(modelValue).toEqual(1000);
      expect(formattedValue).toEqual('%1,000.00000');
    }));

    it('should support undefined values for the skyAutonumericFormChangesUnformatted Input', fakeAsync(() => {
      fixture.componentInstance.setUnformatted = undefined;
      detectChangesTick();

      setValue(1000);

      const formattedValue = getFormattedValue();

      expect(formattedValue).toEqual('%1,000.00000');
    }));

    it('should overwrite global configuration with configuration from the input', fakeAsync(() => {
      setOptions('dollar');

      setValue(1000);

      const modelValue = getModelValue();
      const formattedValue = getFormattedValue();

      expect(modelValue).toEqual(1000);
      expect(formattedValue).toEqual('$1,000.00000');
    }));
  });

  describe('Angular form control statuses', () => {
    it('should set correct statuses when initialized without value', fakeAsync(() => {
      detectChangesTick();

      verifyFormControlStatuses({
        dirty: false,
        pristine: true,
        touched: false,
        valid: true,
      });
    }));

    it('should set correct statuses when initialized with a value', fakeAsync(() => {
      setValue(1000);

      verifyFormControlStatuses({
        dirty: false,
        pristine: true,
        touched: false,
        valid: true,
      });
    }));

    it('should mark the control as touched on blur', fakeAsync(() => {
      detectChangesTick();

      verifyFormControlStatuses({
        touched: false,
      });

      triggerBlur();

      detectChangesTick();

      verifyFormControlStatuses({
        touched: true,
      });
    }));

    it('should mark the control as invalid on keyup if the field is required and the value is undefined', fakeAsync(() => {
      detectChangesTick();
      fixture.componentInstance.formControl.setValidators([
        Validators.required,
      ]);
      fixture.componentInstance.required = true;
      detectChangesTick();

      verifyFormControlStatuses({
        valid: true,
      });

      const inputs = fixture.nativeElement.querySelectorAll('input');
      for (const input of inputs) {
        input.value = '';
        SkyAppTestUtility.fireDomEvent(input, 'input');
        SkyAppTestUtility.fireDomEvent(input, 'keyup');
      }
      detectChangesTick();

      verifyFormControlStatuses({
        valid: false,
      });
    }));

    it('should mark the control as invalid if given a non-numerical value', fakeAsync(() => {
      detectChangesTick();

      verifyFormControlStatuses({
        valid: true,
      });

      setValue('foo');

      verifyFormControlStatuses({
        valid: false,
      });
    }));

    it('should mark the control as dirty on keyup', fakeAsync(() => {
      detectChangesTick();

      verifyFormControlStatuses({
        dirty: false,
      });

      triggerInput();

      detectChangesTick();

      verifyFormControlStatuses({
        dirty: true,
      });
    }));

    it('should disable the form when the form control disabled() method is called', fakeAsync(() => {
      detectChangesTick();
      const formControl = fixture.componentInstance.formControl;
      const input = getReactiveInput();

      // Disable the form via form control.
      formControl.disable();
      detectChangesTick();

      // Expect both the input element and form control to be disabled.
      expect(input.disabled).toEqual(true);
      expect(formControl.disabled).toEqual(true);

      // Enable the form via form control.
      formControl.enable();
      detectChangesTick();

      // Expect both the input element and form control to be enabled.
      expect(input.disabled).toEqual(false);
      expect(formControl.disabled).toEqual(false);
    }));
  });
});
