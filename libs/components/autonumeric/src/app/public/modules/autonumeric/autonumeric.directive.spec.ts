import {
  async,
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick
} from '@angular/core/testing';

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

  function detectChanges(): void {
    fixture.detectChanges();
    tick();
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

    SkyAppTestUtility.fireDomEvent(input, 'blur');
    detectChanges();

    expect(spy).toHaveBeenCalled();
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

  });

});
