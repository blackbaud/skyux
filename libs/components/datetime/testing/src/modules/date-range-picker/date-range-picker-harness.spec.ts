import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import {
  SkyDateRangeCalculatorId,
  SkyDateRangePickerModule,
} from '@skyux/datetime';

import { SkyDateRangePickerHarness } from './date-range-picker-harness';

//#region Test component
@Component({
  selector: 'sky-datepicker-test',
  template: `
    <form [formGroup]="myForm">
      <sky-date-range-picker
        data-sky-id="test-date-range-picker"
        formControlName="testPicker"
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
})
class TestComponent {
  public customErrorFlag = false;
  public helpPopoverContent: string | undefined;
  public helpPopoverTitle: string | undefined;
  public hintText: string | undefined;
  public labelText: string | undefined;
  public myForm: FormGroup;
  public stacked = false;

  constructor(formBuilder: FormBuilder) {
    this.myForm = formBuilder.group({
      testPicker: new FormControl(''),
    });
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

    fixture.componentInstance.myForm.controls['testPicker'].disable();
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
      SkyDateRangeCalculatorId.SpecificRange,
    );
    await expectAsync(dateRangePickerHarness.isEndDateVisible()).toBeResolvedTo(
      true,
    );
  });

  it('should set the start date', async () => {
    const { dateRangePickerHarness, fixture } = await setupTest();

    await dateRangePickerHarness.selectCalculator(
      SkyDateRangeCalculatorId.SpecificRange,
    );
    const newDate = new Date('01/12/1997').toLocaleDateString('en-us', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
    await dateRangePickerHarness.setStartDateValue(newDate);
    expect(
      fixture.componentInstance.myForm.controls['testPicker'].value,
    ).toEqual({
      calculatorId: 3,
      startDate: new Date('01/12/1997'),
      endDate: null,
    });
  });

  it('should set the end date', async () => {
    const { dateRangePickerHarness, fixture } = await setupTest();

    await dateRangePickerHarness.selectCalculator(
      SkyDateRangeCalculatorId.SpecificRange,
    );
    const newDate = new Date('01/12/1997').toLocaleDateString('en-us', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
    await dateRangePickerHarness.setEndDateValue(newDate);
    expect(
      fixture.componentInstance.myForm.controls['testPicker'].value,
    ).toEqual({
      calculatorId: 3,
      endDate: new Date('01/12/1997'),
      startDate: null,
    });
  });

  it('should throw an error if trying to set a date for a hidden datepicker', async () => {
    const { dateRangePickerHarness } = await setupTest();

    await expectAsync(
      dateRangePickerHarness.setStartDateValue('10/12/2023'),
    ).toBeRejectedWithError(
      'Unable to set start date. Start datepicker is not visible.',
    );

    await expectAsync(
      dateRangePickerHarness.setEndDateValue('10/12/2023'),
    ).toBeRejectedWithError(
      'Unable to set end date. End datepicker is not visible.',
    );
  });
});
