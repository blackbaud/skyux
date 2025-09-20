import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { Component, inject, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  FormBuilder,
  FormControl,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import {
  SkyDateRangeCalculation,
  SkyDateRangeCalculator,
  SkyDateRangeCalculatorId,
  SkyDateRangeCalculatorType,
  SkyDateRangePickerModule,
  SkyDateRangeService,
} from '@skyux/datetime';

import { SkyDateRangePickerHarness } from './date-range-picker-harness';

//#region Test component
@Component({
  selector: 'sky-datepicker-test',
  template: `
    <form [formGroup]="myForm">
      <sky-date-range-picker
        data-sky-id="test-date-range-picker"
        formControlName="pickerControl"
        [calculatorIds]="calculatorIds()"
        [helpPopoverContent]="helpPopoverContent"
        [helpPopoverTitle]="helpPopoverTitle"
        [hintText]="hintText"
        [labelText]="labelText"
        [stacked]="stacked"
      >
        @if (customErrorFlag) {
          <sky-form-error errorName="custom" errorText="custom error" />
        }
      </sky-date-range-picker>
      <sky-date-range-picker
        data-sky-id="other-date-range-picker"
        hintText="The other date range picker"
      />
    </form>
  `,
  standalone: false,
})
class TestComponent {
  #dateRangeSvc = inject(SkyDateRangeService);

  public pickerControl = new FormControl<SkyDateRangeCalculation | undefined>(
    undefined,
  );

  public myForm = inject(FormBuilder).group({
    pickerControl: this.pickerControl,
  });

  public customErrorFlag = false;
  public helpPopoverContent: string | undefined;
  public helpPopoverTitle: string | undefined;
  public hintText: string | undefined;
  public labelText: string | undefined;
  public stacked = false;

  protected calculatorIds = signal<SkyDateRangeCalculatorId[]>(
    this.#getCurrentCalculatorIds(),
  );

  #customCalculator: SkyDateRangeCalculator | undefined;

  public createCustomCalculator(): SkyDateRangeCalculatorId {
    if (this.#customCalculator) {
      throw new Error('Custom calculator already exists.');
    }

    this.#customCalculator = this.#dateRangeSvc.createCalculator({
      shortDescription: 'Since 1999',
      type: SkyDateRangeCalculatorType.Relative,
      getValue: () => {
        return {
          startDate: new Date('1/1/1999'),
          endDate: new Date(),
        };
      },
    });

    this.calculatorIds.set(this.#getCurrentCalculatorIds());

    return this.#customCalculator.calculatorId;
  }

  #getCurrentCalculatorIds(): SkyDateRangeCalculatorId[] {
    return this.#dateRangeSvc.calculators.map(
      (calculator) => calculator.calculatorId,
    );
  }
}
//#endregion Test component
describe('Date range picker harness', () => {
  async function setupTest(options?: { dataSkyId: string }): Promise<{
    dateRangePickerHarness: SkyDateRangePickerHarness;
    fixture: ComponentFixture<TestComponent>;
  }> {
    await TestBed.configureTestingModule({
      declarations: [TestComponent],
      imports: [
        FormsModule,
        ReactiveFormsModule,
        SkyDateRangePickerModule,
        NoopAnimationsModule,
      ],
    }).compileComponents();

    const fixture = TestBed.createComponent(TestComponent);
    const loader = TestbedHarnessEnvironment.loader(fixture);
    const dateRangePickerHarness: SkyDateRangePickerHarness = options?.dataSkyId
      ? await loader.getHarness(
          SkyDateRangePickerHarness.with({ dataSkyId: options.dataSkyId }),
        )
      : await loader.getHarness(SkyDateRangePickerHarness);

    return { dateRangePickerHarness, fixture };
  }

  it('should get the date range picker by its data-sky-id', async () => {
    const { dateRangePickerHarness } = await setupTest({
      dataSkyId: 'other-date-range-picker',
    });

    await expectAsync(dateRangePickerHarness.getHintText()).toBeResolvedTo(
      'The other date range picker',
    );
  });

  it('should open help popover when clicked', async () => {
    const { dateRangePickerHarness, fixture } = await setupTest();

    fixture.componentInstance.labelText = 'label';
    fixture.componentInstance.helpPopoverContent = 'content';
    fixture.detectChanges();

    await dateRangePickerHarness.clickHelpInline();

    await expectAsync(
      dateRangePickerHarness.getHelpPopoverContent(),
    ).toBeResolved();
  });

  it('should get help popover content', async () => {
    const { dateRangePickerHarness, fixture } = await setupTest();

    fixture.componentInstance.labelText = 'label';
    fixture.componentInstance.helpPopoverContent = 'content';
    fixture.detectChanges();

    await dateRangePickerHarness.clickHelpInline();

    await expectAsync(
      dateRangePickerHarness.getHelpPopoverContent(),
    ).toBeResolvedTo(fixture.componentInstance.helpPopoverContent);
  });

  it('should get help popover title', async () => {
    const { dateRangePickerHarness, fixture } = await setupTest();

    fixture.componentInstance.labelText = 'label';
    fixture.componentInstance.helpPopoverTitle = 'title';
    fixture.componentInstance.helpPopoverContent = 'content';
    fixture.detectChanges();

    await dateRangePickerHarness.clickHelpInline();

    await expectAsync(
      dateRangePickerHarness.getHelpPopoverTitle(),
    ).toBeResolvedTo(fixture.componentInstance.helpPopoverTitle);
  });

  it('should get hint text', async () => {
    const { dateRangePickerHarness, fixture } = await setupTest();

    fixture.componentInstance.hintText = 'hint text';
    fixture.detectChanges();

    await expectAsync(dateRangePickerHarness.getHintText()).toBeResolvedTo(
      fixture.componentInstance.hintText,
    );
  });

  it('should get label', async () => {
    const { dateRangePickerHarness, fixture } = await setupTest();

    fixture.componentInstance.labelText = 'label';
    fixture.detectChanges();

    await expectAsync(dateRangePickerHarness.getLabelText()).toBeResolvedTo(
      fixture.componentInstance.labelText,
    );
  });

  it('should get whether date range picker is disabled', async () => {
    const { dateRangePickerHarness, fixture } = await setupTest();

    fixture.componentInstance.pickerControl.disable();
    fixture.detectChanges();

    await expectAsync(dateRangePickerHarness.isDisabled()).toBeResolvedTo(true);
  });

  it('should get whether date range picker is stacked', async () => {
    const { dateRangePickerHarness, fixture } = await setupTest();

    fixture.componentInstance.stacked = true;
    fixture.detectChanges();

    await expectAsync(dateRangePickerHarness.isStacked()).toBeResolvedTo(true);
  });

  it('should get whether start date required error is thrown', async () => {
    const { dateRangePickerHarness, fixture } = await setupTest();

    await dateRangePickerHarness.selectCalculator(
      SkyDateRangeCalculatorId.SpecificRange,
    );
    fixture.componentInstance.myForm.markAllAsTouched();
    fixture.detectChanges();

    await expectAsync(
      dateRangePickerHarness.hasStartDateRequiredError(),
    ).toBeResolvedTo(true);
  });

  it('should get whether end date required error is thrown', async () => {
    const { dateRangePickerHarness, fixture } = await setupTest();

    await dateRangePickerHarness.selectCalculator(
      SkyDateRangeCalculatorId.SpecificRange,
    );
    fixture.componentInstance.myForm.markAllAsTouched();
    fixture.detectChanges();

    await expectAsync(
      dateRangePickerHarness.hasEndDateRequiredError(),
    ).toBeResolvedTo(true);
  });

  it('should get whether end date before start date error is thrown', async () => {
    const { dateRangePickerHarness, fixture } = await setupTest();

    fixture.componentInstance.labelText = 'label';
    fixture.detectChanges();
    await dateRangePickerHarness.selectCalculator(
      SkyDateRangeCalculatorId.SpecificRange,
    );
    await dateRangePickerHarness.setStartDateValue('1/2/2023');
    await dateRangePickerHarness.setEndDateValue('1/2/2000');

    await expectAsync(
      dateRangePickerHarness.hasEndDateBeforeStartDateError(),
    ).toBeResolvedTo(true);
  });

  it('should get whether custom error is thrown', async () => {
    const { dateRangePickerHarness, fixture } = await setupTest();

    fixture.componentInstance.labelText = 'label';
    fixture.detectChanges();
    fixture.componentInstance.customErrorFlag = true;
    fixture.componentInstance.myForm.markAllAsTouched();
    fixture.detectChanges();

    await expectAsync(dateRangePickerHarness.hasError('custom')).toBeResolvedTo(
      true,
    );
  });

  it('should get whether start date is visible', async () => {
    const { dateRangePickerHarness } = await setupTest();

    await expectAsync(
      dateRangePickerHarness.isStartDateVisible(),
    ).toBeResolvedTo(false);

    await dateRangePickerHarness.selectCalculator(
      SkyDateRangeCalculatorId.SpecificRange,
    );
    await expectAsync(
      dateRangePickerHarness.isStartDateVisible(),
    ).toBeResolvedTo(true);
  });

  it('should get whether end date is visible', async () => {
    const { dateRangePickerHarness } = await setupTest();

    await expectAsync(dateRangePickerHarness.isEndDateVisible()).toBeResolvedTo(
      false,
    );

    await dateRangePickerHarness.selectCalculator(
      SkyDateRangeCalculatorId.Before,
    );

    await expectAsync(dateRangePickerHarness.isEndDateVisible()).toBeResolvedTo(
      true,
    );
  });

  it('should set the start date', async () => {
    const { dateRangePickerHarness, fixture } = await setupTest();

    await dateRangePickerHarness.selectCalculator(
      SkyDateRangeCalculatorId.After,
    );

    const newDate = new Date('01/12/1997').toLocaleDateString('en-us', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });

    await dateRangePickerHarness.setStartDateValue(newDate);

    expect(fixture.componentInstance.pickerControl.value).toEqual({
      calculatorId: 2,
      startDate: new Date('01/12/1997'),
      endDate: null,
    });

    await expectAsync(
      dateRangePickerHarness.getStartDateValue(),
    ).toBeResolvedTo('01/12/1997');
  });

  it('should set the end date', async () => {
    const { dateRangePickerHarness, fixture } = await setupTest();

    await dateRangePickerHarness.selectCalculator(
      SkyDateRangeCalculatorId.Before,
    );

    const newDate = new Date('01/12/1997').toLocaleDateString('en-us', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });

    await dateRangePickerHarness.setEndDateValue(newDate);

    expect(fixture.componentInstance.pickerControl.value).toEqual({
      calculatorId: 1,
      endDate: new Date('01/12/1997'),
      startDate: null,
    });

    await expectAsync(dateRangePickerHarness.getEndDateValue()).toBeResolvedTo(
      '01/12/1997',
    );
  });

  it('should throw an error if trying to get/set a date for a hidden datepicker', async () => {
    const { dateRangePickerHarness } = await setupTest();

    await dateRangePickerHarness.selectCalculator(
      SkyDateRangeCalculatorId.AnyTime,
    );

    await expectAsync(
      dateRangePickerHarness.getStartDateValue(),
    ).toBeRejectedWithError(
      'Unable to get start date. Start datepicker is not visible.',
    );

    await expectAsync(
      dateRangePickerHarness.setStartDateValue('10/12/2023'),
    ).toBeRejectedWithError(
      'Unable to set start date. Start datepicker is not visible.',
    );

    await expectAsync(
      dateRangePickerHarness.getEndDateValue(),
    ).toBeRejectedWithError(
      'Unable to get end date. End datepicker is not visible.',
    );

    await expectAsync(
      dateRangePickerHarness.setEndDateValue('10/12/2023'),
    ).toBeRejectedWithError(
      'Unable to set end date. End datepicker is not visible.',
    );
  });

  it('should get the selected calculator', async () => {
    const { dateRangePickerHarness, fixture } = await setupTest();

    // Check the value on initialization.
    await expectAsync(
      dateRangePickerHarness.getSelectedCalculator(),
    ).toBeResolvedTo(SkyDateRangeCalculatorId.AnyTime);

    // Set the calculator to a specific range.
    await dateRangePickerHarness.selectCalculator(
      SkyDateRangeCalculatorId.SpecificRange,
    );

    await expectAsync(
      dateRangePickerHarness.getSelectedCalculator(),
    ).toBeResolvedTo(SkyDateRangeCalculatorId.SpecificRange);

    // Set the calculator to an invalid calculator.
    await expectAsync(
      dateRangePickerHarness.selectCalculator(-1 as SkyDateRangeCalculatorId),
    ).toBeRejectedWithError('Could not find calculator with ID -1.');

    // Set the calculator to a custom calculator.
    const customCalculatorId =
      fixture.componentInstance.createCustomCalculator();

    await dateRangePickerHarness.selectCalculator(customCalculatorId);

    await expectAsync(
      dateRangePickerHarness.getSelectedCalculator(),
    ).toBeResolvedTo(customCalculatorId);
  });
});
