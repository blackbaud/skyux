import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  flush,
  tick,
} from '@angular/core/testing';
import { SkyAppTestUtility, expect, expectAsync } from '@skyux-sdk/testing';
import { SkyLogService } from '@skyux/core';
import {
  SkyHelpTestingController,
  SkyHelpTestingModule,
} from '@skyux/core/testing';

import { DateRangePickerTestComponent } from './fixtures/date-range-picker.component.fixture';
import { SkyDateRangeCalculation } from './types/date-range-calculation';
import { SkyDateRangeCalculatorId } from './types/date-range-calculator-id';
import { SkyDateRangeCalculatorType } from './types/date-range-calculator-type';
import { SKY_DEFAULT_CALCULATOR_IDS } from './types/date-range-default-calculator-configs';

describe('Date range picker', function () {
  let fixture: ComponentFixture<DateRangePickerTestComponent>;
  let component: DateRangePickerTestComponent;

  /**
   * Dispatches a focusout event on the specified element.
   * @param target The element losing focus.
   * @param relatedTarget The element receiving focus.
   */
  function blurElement(target?: Element, relatedTarget?: EventTarget): void {
    target?.dispatchEvent(
      new FocusEvent('focusout', {
        bubbles: true,
        cancelable: true,
        relatedTarget,
      }),
    );
  }

  function detectChanges(): void {
    fixture.detectChanges();
    tick();
    fixture.detectChanges();
    tick();
  }

  function getActiveDatepickerCalendar(): HTMLElement {
    const calendarEl = document.querySelector('sky-datepicker-calendar');

    if (!calendarEl) {
      throw new Error('Datepicker calendar not found.');
    }

    return calendarEl as HTMLElement;
  }

  function getCalculatorSelect(): HTMLSelectElement {
    return fixture.nativeElement.querySelector('select');
  }

  function getHelpInlinePopover(): HTMLSelectElement {
    return fixture.nativeElement.querySelectorAll('sky-help-inline');
  }

  function selectCalculator(id: SkyDateRangeCalculatorId): void {
    const selectElement = getCalculatorSelect();

    selectElement.value = id.toString();
    SkyAppTestUtility.fireDomEvent(selectElement, 'input');
    SkyAppTestUtility.fireDomEvent(selectElement, 'change');
  }

  function getEndDateInput(): HTMLInputElement | undefined {
    return fixture.nativeElement.querySelector('input[name="endDate"]');
  }

  function getStartDateInput(): HTMLInputElement | undefined {
    return fixture.nativeElement.querySelector('input[name="startDate"]');
  }

  function enterStartDate(date: string): void {
    const inputElement = getStartDateInput();

    if (inputElement) {
      inputElement.value = date;
      fixture.detectChanges();

      SkyAppTestUtility.fireDomEvent(inputElement, 'change');
      fixture.detectChanges();
      tick();
    }
  }

  function openStartDatepickerCalendar(): void {
    fixture.nativeElement
      .querySelector('.sky-date-range-picker-start-date button')
      ?.click();
  }

  function verifyVisiblePickers(
    id: SkyDateRangeCalculatorId,
    type: SkyDateRangeCalculatorType,
  ): void {
    detectChanges();

    selectCalculator(id);

    detectChanges();

    const formGroups = fixture.nativeElement.querySelectorAll(
      '.sky-date-range-picker-form-group',
    ) as NodeListOf<HTMLDivElement>;

    const showStartDatePicker = !(
      formGroups.item(1).getAttribute('hidden') !== null
    );

    const showEndDatePicker = !(
      formGroups.item(2).getAttribute('hidden') !== null
    );

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
    TestBed.configureTestingModule({
      imports: [DateRangePickerTestComponent, SkyHelpTestingModule],
    });

    fixture = TestBed.createComponent(DateRangePickerTestComponent);
    component = fixture.componentInstance;
  });

  it('should set defaults', fakeAsync(function () {
    detectChanges();

    const labelElement = fixture.nativeElement
      .querySelectorAll('label')
      .item(0);

    expect(labelElement.textContent).toContain('Select a date range');

    const picker = component.dateRangePicker;
    expect(picker.label).toEqual(undefined);
    expect(picker.calculatorIds).toEqual(SKY_DEFAULT_CALCULATOR_IDS);
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
      SKY_DEFAULT_CALCULATOR_IDS,
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

  it('should allow setting the field labelText', fakeAsync(function () {
    component.labelText = 'My label';

    detectChanges();

    const labelElement = fixture.nativeElement
      .querySelectorAll('label')
      .item(0);

    expect(component.dateRangePicker.labelText).toEqual('My label');
    expect(labelElement.textContent).toContain('My label');
  }));

  it('should allow setting the date format', fakeAsync(function () {
    component.dateFormat = 'YYYY-MM-DD';

    detectChanges();

    selectCalculator(SkyDateRangeCalculatorId.After);

    enterStartDate('2000/1/2');

    const inputElement = fixture.nativeElement
      .querySelectorAll('input')
      .item(0);

    expect(inputElement.value).toEqual('2000-01-02');
  }));

  it('should have the lg margin class if stacked is true', fakeAsync(() => {
    component.stacked = true;
    detectChanges();

    const dateRangePicker = fixture.nativeElement.querySelector(
      'sky-date-range-picker',
    );

    expect(dateRangePicker).toHaveClass('sky-form-field-stacked');
  }));

  it('should not have the lg margin class if stacked is false', fakeAsync(() => {
    detectChanges();

    const dateRangePicker = fixture.nativeElement.querySelector(
      'sky-date-range-picker',
    );

    expect(dateRangePicker).not.toHaveClass('sky-form-field-stacked');
  }));

  it('should only show end date picker for Before type', fakeAsync(function () {
    verifyVisiblePickers(
      SkyDateRangeCalculatorId.Before,
      SkyDateRangeCalculatorType.Before,
    );
  }));

  it('should only show start date picker for After type', fakeAsync(function () {
    verifyVisiblePickers(
      SkyDateRangeCalculatorId.After,
      SkyDateRangeCalculatorType.After,
    );
  }));

  it('should both pickers for Range type', fakeAsync(function () {
    verifyVisiblePickers(
      SkyDateRangeCalculatorId.SpecificRange,
      SkyDateRangeCalculatorType.Range,
    );
  }));

  it('should hide both pickers for Relative type', fakeAsync(function () {
    verifyVisiblePickers(
      SkyDateRangeCalculatorId.Tomorrow,
      SkyDateRangeCalculatorType.Relative,
    );
  }));

  it('should set disabled state', fakeAsync(function () {
    detectChanges();

    selectCalculator(SkyDateRangeCalculatorId.SpecificRange);

    detectChanges();

    verifyFormFieldsDisabledStatus(false);

    component.reactiveForm?.disable();

    detectChanges();

    verifyFormFieldsDisabledStatus(true);

    component.reactiveForm?.enable();

    detectChanges();

    verifyFormFieldsDisabledStatus(false);
  }));

  it('should set disabled state on initialization', fakeAsync(function () {
    component.disableReactiveOnInit = true;

    detectChanges();

    verifyFormFieldsDisabledStatus(true);

    component.reactiveForm?.enable();

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
  }));

  it('should set enabled state via template input on initialization', fakeAsync(function () {
    component.templateDisable = false;

    detectChanges();

    verifyFormFieldsDisabledStatus(false);
  }));

  it('should mark the control as touched when the composite control loses focus', fakeAsync(() => {
    detectChanges();

    expect(component.reactiveForm?.touched).toEqual(false);

    // Show both date pickers.
    selectCalculator(SkyDateRangeCalculatorId.SpecificRange);
    detectChanges();

    const selectElement = fixture.nativeElement.querySelector('select');
    const startDateInput = getStartDateInput();
    const endDateInput = getEndDateInput();

    // Move focus to the start date input.
    blurElement(selectElement, startDateInput);
    detectChanges();
    expect(component.reactiveForm?.touched).toEqual(false);

    // Move focus to the opened datepicker calendar.
    openStartDatepickerCalendar();
    const startDateCalendarEl = getActiveDatepickerCalendar();
    blurElement(startDateInput, startDateCalendarEl);
    detectChanges();
    expect(component.reactiveForm?.touched).toEqual(false);

    // Move focus to the end date input.
    blurElement(startDateCalendarEl, endDateInput);
    detectChanges();
    expect(component.reactiveForm?.touched).toEqual(false);

    // Blur the end date input and expect touched.
    blurElement(endDateInput, document.body);
    detectChanges();
    expect(component.reactiveForm?.touched).toEqual(true);
  }));

  it('should mark the underlying control touched if the host control calls markAllAsTouched', () => {
    fixture.detectChanges();

    component.reactiveForm?.markAllAsTouched();

    fixture.detectChanges();

    expect(
      fixture.nativeElement.querySelector('sky-date-range-picker'),
    ).toHaveCssClass('ng-touched');
  });

  it('should mark the underlying control touched if the host control calls markAllAsTouched', () => {
    fixture.detectChanges();

    component.reactiveForm?.markAllAsTouched();

    fixture.detectChanges();

    expect(
      fixture.nativeElement.querySelector('sky-date-range-picker'),
    ).toHaveCssClass('ng-touched');
  });

  it('should mark only start date input as touched when start date is interacted with', () => {
    fixture.detectChanges();

    const datepickerInputs = (
      fixture.nativeElement as HTMLElement
    ).querySelectorAll('.sky-input-group input');

    blurElement(datepickerInputs.item(0));

    fixture.detectChanges();

    expect(datepickerInputs.item(0)).toHaveCssClass('ng-touched');
    expect(datepickerInputs.item(1)).toHaveCssClass('ng-untouched');
  });

  it('should mark only end date input as touched when end date is interacted with', () => {
    fixture.detectChanges();

    const datepickerInputs = fixture.nativeElement.querySelectorAll(
      '.sky-input-group input',
    );

    blurElement(datepickerInputs.item(1));

    fixture.detectChanges();

    expect(datepickerInputs.item(0)).toHaveCssClass('ng-untouched');
    expect(datepickerInputs.item(1)).toHaveCssClass('ng-touched');
  });

  it('should maintain selected value when calculators change', fakeAsync(function () {
    fixture.detectChanges();

    const control = component.dateRange;

    const selectedValue: SkyDateRangeCalculation = {
      calculatorId: SkyDateRangeCalculatorId.SpecificRange,
      startDate: new Date('1/1/2000'),
      endDate: new Date('1/2/2000'),
    };

    control?.setValue(selectedValue);

    detectChanges();

    expect(control?.value).toEqual(selectedValue);

    // Change the available calculators, but make the default calculator the same
    // as the one set in the form initializer (see above);
    component.calculatorIds = [selectedValue.calculatorId];

    detectChanges();

    expect(control?.value).toEqual(selectedValue);
  }));

  it('should not emit changes on the first change', fakeAsync(function () {
    // Initialize date range component with defaults.
    detectChanges();

    expect(component.numValueChangeNotifications).toEqual(0);

    selectCalculator(SkyDateRangeCalculatorId.NextFiscalYear);

    detectChanges();

    expect(component.dateRange?.value.calculatorId).toEqual(
      SkyDateRangeCalculatorId.NextFiscalYear,
    );

    expect(component.numValueChangeNotifications).toEqual(1);
  }));

  it('should set the calculator ID to the default on initialization', fakeAsync(() => {
    fixture.detectChanges();

    expect(getCalculatorSelect().value).toEqual(
      `${SkyDateRangeCalculatorId.AnyTime}`,
    );

    // Clear all microtasks since we only care about the state of the component
    // before the first change detection cycle.
    flush();
  }));

  it('should use default calculator value if control set to `null`', fakeAsync(function () {
    fixture.detectChanges();

    const control = component.dateRange;

    // First, test initialization of control?.
    control?.reset();
    detectChanges();

    const defaultValue = {
      calculatorId: 0,
      endDate: null,
      startDate: null,
    };

    expect(control?.value).toEqual(defaultValue);

    // Finally, test it after the control value has been set once before.
    control?.reset();
    detectChanges();

    expect(control?.value).toEqual(defaultValue);
  }));

  it('should catch validation errors from selected calculator', fakeAsync(function () {
    // Invalidate the control by setting the start date after the end date.
    component.dateRange?.setValue({
      calculatorId: SkyDateRangeCalculatorId.SpecificRange,
      startDate: new Date('1/2/2000'),
      endDate: new Date('1/1/2000'),
    });

    detectChanges();

    const control = component.dateRange;

    expect(control?.errors).toEqual({
      skyDateRange: {
        calculatorId: SkyDateRangeCalculatorId.SpecificRange,
        errors: {
          endDateBeforeStartDate: true,
        },
      },
    });
  }));

  it('should update validation errors from selected calculator', fakeAsync(function () {
    detectChanges();
    selectCalculator(SkyDateRangeCalculatorId.After);
    detectChanges();
    enterStartDate('bogus value');
    detectChanges();

    const control = component.dateRange;

    expect(control?.errors).toEqual({
      skyDate: { invalid: 'bogus value' },
    });

    selectCalculator(SkyDateRangeCalculatorId.Today);
    detectChanges();

    expect(control?.errors).toBeFalsy();
  }));

  it('should clear "required" errors when switching to a calculator without datepickers', fakeAsync(() => {
    component.required = true;
    detectChanges();

    selectCalculator(SkyDateRangeCalculatorId.After);
    detectChanges();

    const control = component.dateRange;
    control?.updateValueAndValidity();

    expect(control?.errors).toEqual({
      required: true,
    });

    selectCalculator(SkyDateRangeCalculatorId.Today);

    detectChanges();

    expect(control?.errors).toBeFalsy();
  }));

  it('should catch validation errors from date picker', fakeAsync(function () {
    detectChanges();

    const control = component.dateRange;

    let value: unknown = {
      calculatorId: SkyDateRangeCalculatorId.SpecificRange,
      startDate: 'invalid',
      endDate: 'invalid',
    };

    control?.setValue(value);

    detectChanges();

    expect(control?.errors).toEqual({
      skyDate: {
        invalid: 'invalid',
      },
    });

    value = {
      calculatorId: SkyDateRangeCalculatorId.After,
      startDate: 'invalid',
    };

    control?.setValue(value);

    detectChanges();

    expect(control?.errors).toEqual({
      skyDate: {
        invalid: 'invalid',
      },
    });
  }));

  it('should reset errors after value change', fakeAsync(function () {
    detectChanges();

    const control = component.dateRange;

    control?.setValue({
      calculatorId: SkyDateRangeCalculatorId.SpecificRange,
      startDate: new Date(),
      endDate: 'invalid',
    });

    detectChanges();

    expect(control?.errors).toBeTruthy();

    control?.patchValue({
      endDate: new Date(),
    });

    detectChanges();

    expect(control?.errors).toBeFalsy();
  }));

  it('should error when end date comes before start date', fakeAsync(function () {
    detectChanges();

    const control = component.dateRange;
    const calculatorIdControl =
      component.dateRangePicker['formGroup']?.get('calculatorId');

    control?.setValue({
      calculatorId: SkyDateRangeCalculatorId.SpecificRange,
    });

    detectChanges();

    const datepickerInputs = fixture.nativeElement.querySelectorAll(
      '.sky-input-group input',
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

    expect(control?.errors).toEqual(expectedError);
    expect(calculatorIdControl?.errors).toEqual(expectedError);

    datepickerInputs.item(1).value = '1/3/2000';
    SkyAppTestUtility.fireDomEvent(datepickerInputs.item(1), 'change');

    detectChanges();

    expect(control?.errors).toBeFalsy();
    expect(calculatorIdControl?.errors).toBeFalsy();
  }));

  it('should visually set start and end date datepickers to required and not the calculator select', () => {
    fixture.componentInstance.required = true;
    fixture.detectChanges();

    const control = component.dateRange;
    control?.setValue({
      calculatorId: SkyDateRangeCalculatorId.SpecificRange,
    });
    fixture.detectChanges();

    const datepickerInputLabels =
      fixture.nativeElement.querySelectorAll('.sky-control-label');
    const calculatorSelectLabel = datepickerInputLabels.item(0);
    const startDateLabel = datepickerInputLabels.item(1);
    const endDateLabel = datepickerInputLabels.item(2);

    expect(calculatorSelectLabel).not.toHaveCssClass(
      'sky-control-label-required',
    );
    expect(startDateLabel).toHaveCssClass('sky-control-label-required');
    expect(endDateLabel).toHaveCssClass('sky-control-label-required');
  });

  it('should show validation errors when start date is required but not provided', fakeAsync(function () {
    fixture.componentInstance.required = true;
    detectChanges();

    const control = component.dateRange;
    const startDateControl =
      component.dateRangePicker['formGroup']?.get('startDate');

    control?.setValue({
      calculatorId: SkyDateRangeCalculatorId.SpecificRange,
    });
    detectChanges();

    const datepickerInputs = fixture.nativeElement.querySelectorAll(
      '.sky-input-group input',
    );

    SkyAppTestUtility.fireDomEvent(datepickerInputs.item(0), 'blur');
    detectChanges();
    const expectedError = {
      required: true,
    };

    expect(control?.errors).toEqual(expectedError);
    expect(startDateControl?.errors).toEqual(expectedError);
  }));

  it('should show validation errors when end date is required but not provided', fakeAsync(function () {
    fixture.componentInstance.required = true;
    detectChanges();

    const control = component.dateRange;
    const endDateControl =
      component.dateRangePicker['formGroup']?.get('endDate');

    control?.setValue({
      calculatorId: SkyDateRangeCalculatorId.SpecificRange,
    });
    detectChanges();

    const datepickerInputs = fixture.nativeElement.querySelectorAll(
      '.sky-input-group input',
    );
    SkyAppTestUtility.fireDomEvent(datepickerInputs.item(1), 'blur');
    detectChanges();

    const expectedError = {
      required: true,
    };

    expect(control?.errors).toEqual(expectedError);
    expect(endDateControl?.errors).toEqual(expectedError);
  }));

  it('should log a deprecation warning when label input is used', fakeAsync(() => {
    const logService = TestBed.inject(SkyLogService);
    const spy = spyOn(logService, 'deprecated');

    fixture.componentInstance.label = 'deprecated label';
    detectChanges();

    expect(spy).toHaveBeenCalledWith('SkyDateRangePickerComponent.label', {
      deprecationMajorVersion: 10,
      replacementRecommendation: 'Use the `labelText` input instead.',
    });
  }));

  it('should render date range specific errors only when labelText is provided', fakeAsync(() => {
    const control = component.dateRange;

    control?.setValue({
      calculatorId: SkyDateRangeCalculatorId.SpecificRange,
      startDate: new Date('1/2/2000'),
      endDate: new Date('1/1/2000'),
    });
    detectChanges();

    control?.updateValueAndValidity();
    control?.markAllAsTouched();
    detectChanges();

    expect(
      fixture.nativeElement.querySelector('sky-form-error')?.textContent.trim(),
    ).toBe(undefined);

    component.labelText = 'Date range picker';
    control?.updateValueAndValidity();
    detectChanges();

    expect(
      fixture.nativeElement.querySelector('sky-form-error')?.textContent.trim(),
    ).toBe(
      'Error: Change the date range so that the end date is before the start date.',
    );
  }));

  it('should ignore extraneous properties when setting the value', () => {
    component.dateRange?.setValue({
      foo: 'bar',
      calculatorId: SkyDateRangeCalculatorId.LastWeek,
    });

    expect(() => fixture.detectChanges()).not.toThrow();
  });

  it('should notify value changes when switching between calculators without datepickers', fakeAsync(() => {
    // Initialize control with a calculator that does not include datepickers.
    component.dateRange?.setValue({
      calculatorId: SkyDateRangeCalculatorId.Today,
    });
    detectChanges();

    expect(component.reactiveForm.value).toEqual({
      dateRange: {
        calculatorId: SkyDateRangeCalculatorId.Today,
        endDate: jasmine.any(Date),
        startDate: jasmine.any(Date),
      },
    });

    selectCalculator(SkyDateRangeCalculatorId.AnyTime);
    detectChanges();

    expect(component.reactiveForm.value).toEqual({
      dateRange: {
        calculatorId: SkyDateRangeCalculatorId.AnyTime,
        startDate: null,
        endDate: null,
      },
    });

    selectCalculator(SkyDateRangeCalculatorId.LastQuarter);
    detectChanges();

    const value = component.reactiveForm.value.dateRange;
    expect(value.calculatorId).toEqual(SkyDateRangeCalculatorId.LastQuarter);
    expect(value.startDate).toEqual(jasmine.any(Date));
    expect(value.endDate).toEqual(jasmine.any(Date));
  }));

  it('should notify value changes only once per change', async () => {
    component.dateRange?.setValue({
      calculatorId: SkyDateRangeCalculatorId.Today,
    });
    fixture.detectChanges();
    await fixture.whenStable();

    expect(component.numValueChangeNotifications).toEqual(0);
    expect(component.reactiveForm.value).toEqual({
      dateRange: {
        calculatorId: SkyDateRangeCalculatorId.Today,
        endDate: jasmine.any(Date),
        startDate: jasmine.any(Date),
      },
    });

    component.numValueChangeNotifications = 0;
    selectCalculator(SkyDateRangeCalculatorId.SpecificRange);
    fixture.detectChanges();
    await fixture.whenStable();

    expect(component.numValueChangeNotifications).toEqual(1);
    expect(component.reactiveForm.value).toEqual({
      dateRange: {
        calculatorId: SkyDateRangeCalculatorId.SpecificRange,
        endDate: null,
        startDate: null,
      },
    });

    // Test a programmatic change.
    component.numValueChangeNotifications = 0;
    component.dateRange?.setValue({
      calculatorId: SkyDateRangeCalculatorId.SpecificRange,
      endDate: new Date('2024/10/25'),
      startDate: new Date('2024/10/26'),
    });
    fixture.detectChanges();
    await fixture.whenStable();

    expect(component.numValueChangeNotifications).toEqual(1);
    expect(component.reactiveForm.value).toEqual({
      dateRange: {
        calculatorId: SkyDateRangeCalculatorId.SpecificRange,
        endDate: jasmine.any(Date),
        startDate: jasmine.any(Date),
      },
    });

    component.numValueChangeNotifications = 0;
    selectCalculator(SkyDateRangeCalculatorId.AnyTime);
    fixture.detectChanges();
    await fixture.whenStable();

    expect(component.numValueChangeNotifications).toEqual(1);
    expect(component.reactiveForm.value).toEqual({
      dateRange: {
        calculatorId: SkyDateRangeCalculatorId.AnyTime,
        endDate: null,
        startDate: null,
      },
    });
  });

  it('should not mark calculator as invalid when the error is from the datepicker', fakeAsync(() => {
    detectChanges();
    selectCalculator(SkyDateRangeCalculatorId.SpecificRange);
    const control = component.dateRange;
    control?.markAllAsTouched();
    detectChanges();

    const calculatorInput = fixture.nativeElement.querySelector(
      '.sky-date-range-picker-select-calculator .sky-input-box-input-group-inner',
    );
    const startInput: HTMLElement = fixture.nativeElement.querySelector(
      '.sky-date-range-picker-start-date .sky-input-box-input-group-inner',
    );

    expect(
      startInput.classList.contains('sky-field-status-invalid'),
    ).toBeTrue();
    expect(
      calculatorInput.classList.contains('sky-field-status-invalid'),
    ).toBeFalse();

    const selectedValue: SkyDateRangeCalculation = {
      calculatorId: SkyDateRangeCalculatorId.SpecificRange,
      startDate: new Date('1/1/2000'),
      endDate: new Date('1/2/1997'),
    };

    control?.setValue(selectedValue);

    detectChanges();

    expect(
      startInput.classList.contains('sky-field-status-invalid'),
    ).toBeTrue();
    expect(
      calculatorInput.classList.contains('sky-field-status-invalid'),
    ).toBeTrue();
  }));

  it('should display custom form errors and mark all inputs as invalid', fakeAsync(() => {
    detectChanges();
    selectCalculator(SkyDateRangeCalculatorId.SpecificRange);
    detectChanges();
    const control = component.dateRange;
    control?.setErrors({
      customError: true,
    });
    control?.markAllAsTouched();
    detectChanges();

    const inputs: HTMLElement[] = fixture.nativeElement.querySelectorAll(
      '.sky-input-box-input-group-inner',
    );

    inputs.forEach((input) => {
      expect(input.classList.contains('sky-field-status-invalid')).toBeTrue();
    });

    expect(
      fixture.nativeElement.querySelector('sky-form-error')?.textContent.trim(),
    ).toBe('Error: This is a custom error.');
  }));

  describe('accessibility', () => {
    function verifyFormFieldsRequired(expectation: boolean): void {
      const inputBoxes =
        fixture.nativeElement.querySelectorAll('sky-input-box');
      const inputs = fixture.nativeElement.querySelectorAll('input');

      expect(
        inputBoxes.item(1).querySelector('.sky-control-label-required'),
      ).toEqual(expectation ? jasmine.any(HTMLLabelElement) : null);
      expect(
        inputBoxes.item(2).querySelector('.sky-control-label-required'),
      ).toEqual(expectation ? jasmine.any(HTMLLabelElement) : null);

      expect(inputs.item(0).hasAttribute('required')).toEqual(expectation);
      expect(inputs.item(1).hasAttribute('required')).toEqual(expectation);
    }

    it('should use a context specific datepicker aria label when using the "Before" calculator', fakeAsync(() => {
      detectChanges();

      component.label = 'Last donation';
      const control = component.dateRange;
      control?.setValue({
        calculatorId: SkyDateRangeCalculatorId.Before,
      });

      detectChanges();
      const input = getEndDateInput();
      expect(input?.getAttribute('aria-label')).toBe(
        'Before date for Last donation',
      );

      component.labelText = 'Latest donation';
      detectChanges();

      expect(input?.getAttribute('aria-label')).toBe(
        'Before date for Latest donation',
      );
    }));

    it('should use a context specific datepicker aria label when using the "After" calculator', fakeAsync(() => {
      detectChanges();

      component.label = 'Last donation';
      const control = component.dateRange;
      control?.setValue({
        calculatorId: SkyDateRangeCalculatorId.After,
      });

      detectChanges();
      const input = getStartDateInput();
      expect(input?.getAttribute('aria-label')).toBe(
        'After date for Last donation',
      );

      component.labelText = 'Latest donation';
      detectChanges();

      expect(input?.getAttribute('aria-label')).toBe(
        'After date for Latest donation',
      );
    }));

    it('should use context specific datepicker aria labels when using the "Specific Range" calculator', fakeAsync(() => {
      detectChanges();

      component.label = 'Last donation';
      const control = component.dateRange;
      control?.setValue({
        calculatorId: SkyDateRangeCalculatorId.SpecificRange,
      });

      detectChanges();
      const fromInput = getStartDateInput();
      const toInput = getEndDateInput();
      expect(fromInput?.getAttribute('aria-label')).toBe(
        'From date for Last donation',
      );
      expect(toInput?.getAttribute('aria-label')).toBe(
        'To date for Last donation',
      );

      component.labelText = 'Latest donation';
      detectChanges();

      expect(fromInput?.getAttribute('aria-label')).toBe(
        'From date for Latest donation',
      );
      expect(toInput?.getAttribute('aria-label')).toBe(
        'To date for Latest donation',
      );
    }));

    it('should use a default datepicker aria label when using the "Before" calculator with no label', fakeAsync(() => {
      detectChanges();

      const control = component.dateRange;
      control?.setValue({
        calculatorId: SkyDateRangeCalculatorId.Before,
      });

      detectChanges();
      const input = getEndDateInput();
      expect(input?.getAttribute('aria-label')).toBe('Before date');
    }));

    it('should use a default datepicker aria label when using the "After" calculator with no label', fakeAsync(() => {
      detectChanges();

      const control = component.dateRange;
      control?.setValue({
        calculatorId: SkyDateRangeCalculatorId.After,
      });

      detectChanges();
      const input = getStartDateInput();
      expect(input?.getAttribute('aria-label')).toBe('After date');
    }));

    it('should use default datepicker aria labels when using the "Specific Range" calculator with no label', fakeAsync(() => {
      detectChanges();
      const control = component.dateRange;
      control?.setValue({
        calculatorId: SkyDateRangeCalculatorId.SpecificRange,
      });

      detectChanges();
      const fromInput = getStartDateInput();
      const toInput = getEndDateInput();
      expect(fromInput?.getAttribute('aria-label')).toBe('From date');
      expect(toInput?.getAttribute('aria-label')).toBe('To date');
    }));

    it('should be accessible with no label', async () => {
      fixture.detectChanges();
      await fixture.whenStable();
      await expectAsync(fixture.elementRef.nativeElement).toBeAccessible();
    });

    it('should be accessible with a label', async () => {
      component.label = 'Last donation';
      fixture.detectChanges();
      await fixture.whenStable();
      await expectAsync(fixture.elementRef.nativeElement).toBeAccessible();
    });

    it('should be accessible with a labelText', async () => {
      component.labelText = 'Last donation';
      fixture.detectChanges();
      await fixture.whenStable();
      await expectAsync(fixture.elementRef.nativeElement).toBeAccessible();
    });

    it('should always set required attribute on the date pickers', fakeAsync(() => {
      detectChanges();
      selectCalculator(SkyDateRangeCalculatorId.SpecificRange);
      detectChanges();
      verifyFormFieldsRequired(true);

      component.setFormControlRequired(true);
      detectChanges();
      verifyFormFieldsRequired(true);

      component.setFormControlRequired(false);
      detectChanges();
      verifyFormFieldsRequired(true);
    }));

    it('it should render help inline if helpPopoverContent is provided', fakeAsync(() => {
      detectChanges();

      expect(getHelpInlinePopover().length).toBe(0);

      component.helpPopoverContent = 'content';
      fixture.detectChanges();

      expect(getHelpInlinePopover().length).toBe(1);
    }));

    it('should render help inline if helpKey is provided', () => {
      fixture.detectChanges();

      expect(
        fixture.nativeElement.querySelector(
          '.sky-help-inline:not(.sky-control-help)',
        ),
      ).toBeFalsy();

      component.helpKey = 'helpKey.html';
      fixture.detectChanges();

      expect(
        fixture.nativeElement.querySelector(
          '.sky-help-inline:not(.sky-control-help)',
        ),
      ).toBeTruthy();
    });

    it('should set global help config with help key', async () => {
      const helpController = TestBed.inject(SkyHelpTestingController);
      component.helpKey = 'helpKey.html';
      fixture.detectChanges();

      const helpInlineButton = fixture.nativeElement.querySelector(
        '.sky-help-inline',
      ) as HTMLElement | undefined;

      helpInlineButton?.click();

      fixture.detectChanges();
      await fixture.whenStable();

      helpController.expectCurrentHelpKey('helpKey.html');
    });
  });
});
