import {
  async,
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick
} from '@angular/core/testing';

import {
  AbstractControl
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

  function detectChanges(): void {
    fixture.detectChanges();
    tick();
  }

  function setValue(value: number): void {
    fixture.componentInstance.formGroup.get('donationAmount').setValue(value);
  }

  function setOptions(options: SkyAutonumericOptions): void {
    fixture.componentInstance.autonumericOptions = options;
  }

  function getFormattedValue(): string {
    return fixture.nativeElement.querySelector('input').value;
  }

  function getModelValue(): number {
    return fixture.componentInstance.formControl.value;
  }

  function verifyFormControlStatuses(
    control: AbstractControl,
    statuses: {
      pristine: boolean;
      touched: boolean;
      valid: boolean;
    }
  ): void {
    expect(control.pristine).toEqual(statuses.pristine);
    expect(control.touched).toEqual(statuses.touched);
    expect(control.valid).toEqual(statuses.valid);
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

      verifyFormControlStatuses(
        fixture.componentInstance.formControl,
        {
          pristine: true,
          touched: false,
          valid: true
        }
      );
    }));

    it('should set correct statuses when initialized with a value', fakeAsync(() => {
      detectChanges();

      setValue(1000);

      detectChanges();

      verifyFormControlStatuses(
        fixture.componentInstance.formControl,
        {
          pristine: true,
          touched: false,
          valid: true
        }
      );
    }));

    it('should mark the control as touched on blur', fakeAsync(() => {
      detectChanges();

      expect(fixture.componentInstance.formControl.touched).toEqual(false);

      SkyAppTestUtility.fireDomEvent(fixture.nativeElement.querySelector('input'), 'blur');

      detectChanges();

      expect(fixture.componentInstance.formControl.touched).toEqual(true);
    }));

    it('should mark the control as dirty on keyup', fakeAsync(() => {
      detectChanges();

      expect(fixture.componentInstance.formControl.dirty).toEqual(false);

      SkyAppTestUtility.fireDomEvent(fixture.nativeElement.querySelector('input'), 'keyup');

      detectChanges();

      expect(fixture.componentInstance.formControl.dirty).toEqual(true);
    }));

  });

});
