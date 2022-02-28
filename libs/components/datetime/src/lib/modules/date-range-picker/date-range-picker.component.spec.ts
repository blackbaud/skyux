import {
  ComponentFixture,
  TestBed,
  async,
  fakeAsync,
  tick,
} from '@angular/core/testing';
import { SkyAppTestUtility, expect, expectAsync } from '@skyux-sdk/testing';
import {
  SkyTheme,
  SkyThemeMode,
  SkyThemeService,
  SkyThemeSettings,
  SkyThemeSettingsChange,
} from '@skyux/theme';

import moment from 'moment';
import { BehaviorSubject } from 'rxjs';

import { DateRangePickerTestComponent } from './fixtures/date-range-picker.component.fixture';
import { DateRangePickerTestModule } from './fixtures/date-range-picker.module.fixture';
import { SkyDateRangeCalculation } from './types/date-range-calculation';
import { SkyDateRangeCalculatorId } from './types/date-range-calculator-id';
import { SkyDateRangeCalculatorType } from './types/date-range-calculator-type';

const defaultCalculatorIds = [
  SkyDateRangeCalculatorId.AnyTime,
  SkyDateRangeCalculatorId.Before,
  SkyDateRangeCalculatorId.After,
  SkyDateRangeCalculatorId.SpecificRange,
  SkyDateRangeCalculatorId.Yesterday,
  SkyDateRangeCalculatorId.Today,
  SkyDateRangeCalculatorId.Tomorrow,
  SkyDateRangeCalculatorId.LastWeek,
  SkyDateRangeCalculatorId.ThisWeek,
  SkyDateRangeCalculatorId.NextWeek,
  SkyDateRangeCalculatorId.LastMonth,
  SkyDateRangeCalculatorId.ThisMonth,
  SkyDateRangeCalculatorId.NextMonth,
  SkyDateRangeCalculatorId.LastQuarter,
  SkyDateRangeCalculatorId.ThisQuarter,
  SkyDateRangeCalculatorId.NextQuarter,
  SkyDateRangeCalculatorId.LastCalendarYear,
  SkyDateRangeCalculatorId.ThisCalendarYear,
  SkyDateRangeCalculatorId.NextCalendarYear,
  SkyDateRangeCalculatorId.LastFiscalYear,
  SkyDateRangeCalculatorId.ThisFiscalYear,
  SkyDateRangeCalculatorId.NextFiscalYear,
];

describe('Date range picker', function () {
  let fixture: ComponentFixture<DateRangePickerTestComponent>;
  let component: DateRangePickerTestComponent;
  let mockThemeSvc: {
    settingsChange: BehaviorSubject<SkyThemeSettingsChange>;
  };

  function detectChanges(): void {
    fixture.detectChanges();
    tick();
    fixture.detectChanges();
    tick();
  }

  function getLocaleLongDateFormat(): string {
    return moment.localeData().longDateFormat('L');
  }

  function selectCalculator(id: SkyDateRangeCalculatorId): void {
    component.reactiveForm.setValue({
      dateRange: {
        calculatorId: id,
      },
    });
  }

  function enterStartDate(date: string): void {
    const inputElement = fixture.nativeElement
      .querySelectorAll('input')
      .item(0);
    inputElement.value = date;
    fixture.detectChanges();

    SkyAppTestUtility.fireDomEvent(inputElement, 'change');
    fixture.detectChanges();
    tick();
  }

  function verifyVisiblePickers(
    id: SkyDateRangeCalculatorId,
    type: SkyDateRangeCalculatorType
  ): void {
    detectChanges();

    selectCalculator(id);

    detectChanges();

    const showStartDatePicker = component.dateRangePicker.showStartDatePicker;
    const showEndDatePicker = component.dateRangePicker.showEndDatePicker;

    // Check if element is hidden.
    switch (type) {
      case SkyDateRangeCalculatorType.Before:
        expect(showStartDatePicker).toBeFalsy();
        expect(showEndDatePicker).toBeTruthy();
        break;

      case SkyDateRangeCalculatorType.After:
        expect(showStartDatePicker).toBeTruthy();
        expect(showEndDatePicker).toBeFalsy();
        break;

      case SkyDateRangeCalculatorType.Range:
        expect(showStartDatePicker).toBeTruthy();
        expect(showEndDatePicker).toBeTruthy();
        break;

      default:
      case SkyDateRangeCalculatorType.Relative:
        expect(showStartDatePicker).toBeFalsy();
        expect(showEndDatePicker).toBeFalsy();
        break;
    }
  }

  function verifyFormFieldsDisabledStatus(expectation: boolean): void {
    const selectElement = fixture.nativeElement.querySelector('select');
    const inputs = fixture.nativeElement.querySelectorAll('input');

    expect(selectElement.disabled).toEqual(expectation);
    expect(inputs.item(0).disabled).toEqual(expectation);
    expect(inputs.item(1).disabled).toEqual(expectation);
  }

  beforeEach(function () {
    mockThemeSvc = {
      settingsChange: new BehaviorSubject<SkyThemeSettingsChange>({
        currentSettings: new SkyThemeSettings(
          SkyTheme.presets.default,
          SkyThemeMode.presets.light
        ),
        previousSettings: undefined,
      }),
    };

    TestBed.configureTestingModule({
      imports: [DateRangePickerTestModule],
      providers: [
        {
          provide: SkyThemeService,
          useValue: mockThemeSvc,
        },
      ],
    });

    fixture = TestBed.createComponent(DateRangePickerTestComponent);
    component = fixture.componentInstance;
  });

  afterEach(function () {
    fixture.destroy();
  });

  it('should set defaults', fakeAsync(function () {
    detectChanges();

    const labelElement = fixture.nativeElement
      .querySelectorAll('label')
      .item(0);

    expect(labelElement.textContent).toContain('Select a date range');

    const picker = component.dateRangePicker;
    const defaultFormat = getLocaleLongDateFormat();
    expect(picker.dateFormat).toEqual(defaultFormat);
    expect(picker.label).toEqual(undefined);
    expect(picker.calculatorIds).toEqual(defaultCalculatorIds);
  }));

  it('should allow setting specific calculators', fakeAsync(function () {
    component.calculatorIds = [
      SkyDateRangeCalculatorId.Before,
      SkyDateRangeCalculatorId.After,
      SkyDateRangeCalculatorId.SpecificRange,
    ];

    detectChanges();

    expect(component.dateRangePicker.calculatorIds).toEqual([
      SkyDateRangeCalculatorId.Before,
      SkyDateRangeCalculatorId.After,
      SkyDateRangeCalculatorId.SpecificRange,
    ]);

    // Reset the calculators to verify defaults are set.
    component.calculatorIds = undefined;

    detectChanges();

    expect(component.dateRangePicker.calculatorIds).toEqual(
      defaultCalculatorIds
    );
  }));

  it('should allow setting calculators asynchronously', fakeAsync(function () {
    component.setCalculatorIdsAsync();

    detectChanges();

    expect(component.dateRangePicker.calculatorIds).toEqual([
      SkyDateRangeCalculatorId.After,
    ]);
  }));

  it('should allow setting the field label', fakeAsync(function () {
    component.label = 'My label';

    detectChanges();

    const labelElement = fixture.nativeElement
      .querySelectorAll('label')
      .item(0);

    expect(component.dateRangePicker.label).toEqual('My label');
    expect(labelElement.textContent).toContain('My label');
  }));

  it('should allow setting the date format', fakeAsync(function () {
    component.dateFormat = 'YYYY-MM-DD';

    detectChanges();

    selectCalculator(SkyDateRangeCalculatorId.Before);

    enterStartDate('2000/1/2');

    const inputElement = fixture.nativeElement
      .querySelectorAll('input')
      .item(0);

    expect(inputElement.value).toEqual('2000-01-02');
  }));

  it('should only show end date picker for Before type', fakeAsync(function () {
    verifyVisiblePickers(
      SkyDateRangeCalculatorId.Before,
      SkyDateRangeCalculatorType.Before
    );
  }));

  it('should only show start date picker for After type', fakeAsync(function () {
    verifyVisiblePickers(
      SkyDateRangeCalculatorId.After,
      SkyDateRangeCalculatorType.After
    );
  }));

  it('should both pickers for Range type', fakeAsync(function () {
    verifyVisiblePickers(
      SkyDateRangeCalculatorId.SpecificRange,
      SkyDateRangeCalculatorType.Range
    );
  }));

  it('should hide both pickers for Relative type', fakeAsync(function () {
    verifyVisiblePickers(
      SkyDateRangeCalculatorId.Tomorrow,
      SkyDateRangeCalculatorType.Relative
    );
  }));

  it('should set disabled state', fakeAsync(function () {
    detectChanges();

    selectCalculator(SkyDateRangeCalculatorId.SpecificRange);

    detectChanges();

    verifyFormFieldsDisabledStatus(false);

    component.reactiveForm.disable();

    detectChanges();

    verifyFormFieldsDisabledStatus(true);

    component.reactiveForm.enable();

    detectChanges();

    verifyFormFieldsDisabledStatus(false);
  }));

  it('should set disabled state on initialization', fakeAsync(function () {
    component.disableReactiveOnInit = true;

    detectChanges();

    verifyFormFieldsDisabledStatus(true);

    component.reactiveForm.enable();

    detectChanges();

    verifyFormFieldsDisabledStatus(false);
  }));

  it('should set disabled state via template input', fakeAsync(function () {
    component.templateDisable = false;

    detectChanges();

    selectCalculator(SkyDateRangeCalculatorId.SpecificRange);

    detectChanges();

    verifyFormFieldsDisabledStatus(false);

    component.templateDisable = true;

    detectChanges();

    verifyFormFieldsDisabledStatus(true);

    component.templateDisable = false;

    detectChanges();

    verifyFormFieldsDisabledStatus(false);
  }));

  it('should set disabled state via template input on initialization', fakeAsync(function () {
    component.templateDisable = true;

    detectChanges();

    verifyFormFieldsDisabledStatus(true);

    component.templateDisable = false;

    detectChanges();

    verifyFormFieldsDisabledStatus(false);
  }));

  it('should allow for disabling the control on initialization', fakeAsync(function () {
    component.initialValue = {
      calculatorId: SkyDateRangeCalculatorId.SpecificRange,
    };
    component.initialDisabled = true;

    detectChanges();

    const control = component.dateRange;

    expect(control.disabled).toBe(true);
    verifyFormFieldsDisabledStatus(true);
  }));

  it('should mark the control as touched when select is blurred', fakeAsync(function () {
    detectChanges();

    expect(component.reactiveForm.touched).toEqual(false);

    const selectElement = fixture.nativeElement.querySelector('select');
    SkyAppTestUtility.fireDomEvent(selectElement, 'blur');

    detectChanges();

    expect(component.reactiveForm.touched).toEqual(true);
  }));

  it('should maintain selected value when calculators change', fakeAsync(function () {
    fixture.detectChanges();

    const control = component.dateRange;

    const selectedValue: SkyDateRangeCalculation = {
      calculatorId: SkyDateRangeCalculatorId.SpecificRange,
      startDate: new Date('1/1/2000'),
      endDate: new Date('1/2/2000'),
    };

    control.setValue(selectedValue);

    detectChanges();

    expect(control.value).toEqual(selectedValue);

    // Change the available calculators, but make the default calculator the same
    // as the one set in the form initializer (see above);
    component.calculatorIds = [selectedValue.calculatorId];

    detectChanges();

    expect(control.value).toEqual(selectedValue);
  }));

  it('should not emit changes on the first change', fakeAsync(function () {
    // Initialize date range component with defaults.
    detectChanges();

    expect(component.numValueChangeNotifications).toEqual(0);

    selectCalculator(SkyDateRangeCalculatorId.NextFiscalYear);

    detectChanges();

    expect(component.dateRange.value.calculatorId).toEqual(
      SkyDateRangeCalculatorId.NextFiscalYear
    );

    expect(component.numValueChangeNotifications).toEqual(1);
  }));

  it('should use default calculator value if control set to `null`', fakeAsync(function () {
    fixture.detectChanges();

    const control = component.dateRange;

    // First, test initialization of control.
    control.reset();
    detectChanges();

    const defaultValue = component.dateRangePicker.calculators[0].getValue();
    expect(control.value).toEqual(defaultValue);

    // Finally, test it after the control value has been set once before.
    control.reset();
    detectChanges();

    expect(control.value).toEqual(defaultValue);
  }));

  it('should catch validation errors from selected calculator', fakeAsync(function () {
    // Invalidate the control by setting the start date after the end date.
    component.initialValue = {
      calculatorId: SkyDateRangeCalculatorId.SpecificRange,
      startDate: new Date('1/2/2000'),
      endDate: new Date('1/1/2000'),
    };

    detectChanges();

    const control = component.dateRange;

    expect(control.errors).toEqual({
      skyDateRange: {
        calculatorId: SkyDateRangeCalculatorId.SpecificRange,
        errors: {
          endDateBeforeStartDate: true,
        },
      },
    });
  }));

  it('should catch validation errors from date picker', fakeAsync(function () {
    detectChanges();

    const control = component.dateRange;

    const value: any = {
      calculatorId: SkyDateRangeCalculatorId.SpecificRange,
      startDate: 'invalid',
      endDate: 'invalid',
    };

    control.setValue(value);

    detectChanges();

    expect(control.errors).toEqual({
      skyDate: {
        invalid: 'invalid',
      },
    });
  }));

  it('should reset errors after value change', fakeAsync(function () {
    detectChanges();

    const control = component.dateRange;

    control.setValue({
      calculatorId: SkyDateRangeCalculatorId.SpecificRange,
      startDate: new Date(),
      endDate: 'invalid',
    });

    detectChanges();

    expect(control.errors).toBeTruthy();

    control.patchValue({
      endDate: new Date(),
    });

    detectChanges();

    expect(control.errors).toBeFalsy();
  }));

  it('should catch validation errors from date picker on initialization', fakeAsync(function () {
    component.initialValue = {
      calculatorId: SkyDateRangeCalculatorId.SpecificRange,
      startDate: 'invalid',
    } as any;

    detectChanges();

    const control = component.dateRange;

    expect(control.errors).toEqual({
      skyDate: {
        invalid: 'invalid',
      },
    });
  }));

  it('should error when end date comes before start date', fakeAsync(function () {
    detectChanges();

    const control = component.dateRange;
    const calculatorIdControl =
      component.dateRangePicker.formGroup.get('calculatorId');

    control.setValue({
      calculatorId: SkyDateRangeCalculatorId.SpecificRange,
    });

    detectChanges();

    expect(control.errors).toBeFalsy();
    expect(calculatorIdControl.errors).toBeFalsy();

    const datepickerInputs = fixture.nativeElement.querySelectorAll(
      '.sky-input-group input'
    );

    datepickerInputs.item(0).value = '1/2/2000';
    datepickerInputs.item(1).value = '1/1/2000';

    SkyAppTestUtility.fireDomEvent(datepickerInputs.item(0), 'change');
    SkyAppTestUtility.fireDomEvent(datepickerInputs.item(1), 'change');

    detectChanges();

    const expectedError = {
      skyDateRange: {
        calculatorId: SkyDateRangeCalculatorId.SpecificRange,
        errors: {
          endDateBeforeStartDate: true,
        },
      },
    };

    expect(control.errors).toEqual(expectedError);
    expect(calculatorIdControl.errors).toEqual(expectedError);

    datepickerInputs.item(1).value = '1/3/2000';
    SkyAppTestUtility.fireDomEvent(datepickerInputs.item(1), 'change');

    detectChanges();

    expect(control.errors).toBeFalsy();
    expect(calculatorIdControl.errors).toBeFalsy();
  }));

  it('should show validation errors when start date is required but not provided', fakeAsync(function () {
    fixture.componentInstance.startDateRequired = true;
    detectChanges();
    const control = component.dateRange;
    const calculatorIdControl =
      component.dateRangePicker.formGroup.get('calculatorId');
    control.setValue({
      calculatorId: SkyDateRangeCalculatorId.SpecificRange,
    });
    detectChanges();
    const datepickerInputs = fixture.nativeElement.querySelectorAll(
      '.sky-input-group input'
    );

    SkyAppTestUtility.fireDomEvent(datepickerInputs.item(0), 'blur');
    detectChanges();
    const expectedError = {
      required: true,
    };

    expect(control.errors).toEqual(expectedError);
    expect(calculatorIdControl.errors).toEqual(expectedError);
  }));

  it('should show validation errors when end date is required but not provided', fakeAsync(function () {
    fixture.componentInstance.endDateRequired = true;
    detectChanges();
    const control = component.dateRange;
    const calculatorIdControl =
      component.dateRangePicker.formGroup.get('calculatorId');
    control.setValue({
      calculatorId: SkyDateRangeCalculatorId.SpecificRange,
    });
    detectChanges();
    const datepickerInputs = fixture.nativeElement.querySelectorAll(
      '.sky-input-group input'
    );

    SkyAppTestUtility.fireDomEvent(datepickerInputs.item(1), 'blur');
    detectChanges();
    const expectedError = {
      required: true,
    };

    expect(control.errors).toEqual(expectedError);
    expect(calculatorIdControl.errors).toEqual(expectedError);
  }));

  it('should be accessible', async () => {
    fixture.detectChanges();
    await fixture.whenStable();
    await expectAsync(fixture.elementRef.nativeElement).toBeAccessible();
  });
});
