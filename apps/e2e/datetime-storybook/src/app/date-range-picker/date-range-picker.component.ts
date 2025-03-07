import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import {
  SkyDateRangeCalculation,
  SkyDateRangeCalculatorId,
} from '@skyux/datetime';

@Component({
  selector: 'app-date-range-picker',
  templateUrl: './date-range-picker.component.html',
  styleUrls: ['./date-range-picker.component.scss'],
  standalone: false,
})
export class DateRangePickerComponent {
  public scenarios: {
    name: string;
    label: string;
    calculatorIds: SkyDateRangeCalculatorId[];
    hintText?: string;
    helpInlineContent?: string;
  }[] = [
    {
      name: 'anyDate',
      label: 'Any date example',
      hintText: 'Hint Text.',
      calculatorIds: [SkyDateRangeCalculatorId.AnyTime],
    },
    {
      name: 'helpInline',
      label: 'Help Inline Example',
      helpInlineContent: 'content',
      calculatorIds: [SkyDateRangeCalculatorId.AnyTime],
    },
    {
      name: 'before',
      label: 'Before example',
      calculatorIds: [SkyDateRangeCalculatorId.Before],
    },
    {
      name: 'after',
      label: 'After example',
      calculatorIds: [SkyDateRangeCalculatorId.After],
    },
    {
      name: 'range',
      label: 'Specific range example',
      calculatorIds: [SkyDateRangeCalculatorId.SpecificRange],
    },
    {
      name: 'rangeRequired',
      label: 'Required example',
      calculatorIds: [SkyDateRangeCalculatorId.SpecificRange],
    },
    {
      name: 'rangeInvalid',
      label: 'Invalid example',
      calculatorIds: [SkyDateRangeCalculatorId.SpecificRange],
    },
    {
      name: 'disabled',
      label: 'Disabled example',
      calculatorIds: [SkyDateRangeCalculatorId.SpecificRange],
    },
  ];
  public dateFormat: string | undefined;
  public disabled = false;
  public reactiveForm: FormGroup<{
    anyDate: FormControl<SkyDateRangeCalculation | null>;
    before: FormControl<SkyDateRangeCalculation | null>;
    after: FormControl<SkyDateRangeCalculation | null>;
    helpInline: FormControl<SkyDateRangeCalculation | null>;
    range: FormControl<SkyDateRangeCalculation | null>;
    rangeRequired: FormControl<SkyDateRangeCalculation | null>;
    rangeInvalid: FormControl<SkyDateRangeCalculation | null>;
    disabled: FormControl<SkyDateRangeCalculation | null>;
  }>;

  constructor(formBuilder: FormBuilder) {
    const value: Partial<SkyDateRangeCalculation> = {
      startDate: new Date('2020-01-01T12:00:00.000Z'),
      endDate: new Date('2020-01-31T00:12:00.000Z'),
    };
    this.reactiveForm = formBuilder.group({
      anyDate: new FormControl<SkyDateRangeCalculation | null>({
        ...value,
        calculatorId: SkyDateRangeCalculatorId.AnyTime,
      }),
      before: new FormControl<SkyDateRangeCalculation | null>({
        ...value,
        calculatorId: SkyDateRangeCalculatorId.Before,
      }),
      after: new FormControl<SkyDateRangeCalculation | null>({
        ...value,
        calculatorId: SkyDateRangeCalculatorId.After,
      }),
      helpInline: new FormControl<SkyDateRangeCalculation | null>({
        ...value,
        calculatorId: SkyDateRangeCalculatorId.AnyTime,
      }),
      range: new FormControl<SkyDateRangeCalculation | null>({
        ...value,
        calculatorId: SkyDateRangeCalculatorId.SpecificRange,
      }),
      rangeRequired: new FormControl<SkyDateRangeCalculation | null>({
        ...value,
        calculatorId: SkyDateRangeCalculatorId.SpecificRange,
      }),
      rangeInvalid: new FormControl<SkyDateRangeCalculation | null>({
        ...value,
        calculatorId: SkyDateRangeCalculatorId.SpecificRange,
      }),
      disabled: new FormControl<SkyDateRangeCalculation | null>({
        value: {
          ...value,
          calculatorId: SkyDateRangeCalculatorId.SpecificRange,
        },
        disabled: true,
      }),
    });
  }

  public submit(): void {
    const value = this.reactiveForm.value;
    console.log('Form submitted with:', value);
  }
}
