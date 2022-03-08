import { Component, OnInit } from '@angular/core';

import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
} from '@angular/forms';

import {
  SkyDateRangeCalculation,
  SkyDateRangeCalculatorId,
  SkyDateRangeService,
} from '@skyux/datetime';

@Component({
  selector: 'app-date-range-picker',
  templateUrl: './date-range-picker.component.html',
  styleUrls: ['./date-range-picker.component.scss'],
})
export class DateRangePickerComponent implements OnInit {
  public calculatorIds: SkyDateRangeCalculatorId[];
  public dateFormat: string;
  public disabled = false;
  public endDateRequired = false;
  public reactiveForm: FormGroup;
  public startDateRequired = false;

  public get pickerFormControl(): AbstractControl {
    return this.reactiveForm.get('lastDonation');
  }

  constructor(
    private dateRangeService: SkyDateRangeService,
    private formBuilder: FormBuilder
  ) {}

  public ngOnInit(): void {
    this.reactiveForm = this.formBuilder.group({
      lastDonation: new FormControl(),
    });
    this.pickerFormControl.statusChanges.subscribe((status) => {
      console.log(
        'Date range status change:',
        status,
        this.pickerFormControl.errors
      );
    });

    this.pickerFormControl.valueChanges.subscribe((value) => {
      console.log('Date range value change:', value);
    });
  }

  public toggleDisabled(): void {
    this.disabled = !this.disabled;
    if (this.reactiveForm.disabled) {
      this.reactiveForm.enable();
    } else {
      this.reactiveForm.disable();
    }
  }

  public resetForm(): void {
    this.reactiveForm.reset();
    this.reactiveForm.markAsPristine();
    this.reactiveForm.markAsUntouched();
  }

  public setRange(): void {
    const range: SkyDateRangeCalculation = {
      calculatorId: SkyDateRangeCalculatorId.SpecificRange,
      startDate: new Date('1/1/2012'),
      endDate: new Date('1/1/2013'),
    };

    this.pickerFormControl.setValue(range);
  }

  public setInvalidRange(): void {
    const range: SkyDateRangeCalculation = {
      calculatorId: SkyDateRangeCalculatorId.SpecificRange,
      startDate: new Date('1/1/2013'),
      endDate: new Date('1/1/2012'),
    };

    this.pickerFormControl.setValue(range);
  }

  public setInvalidDates(): void {
    const range: SkyDateRangeCalculation = {
      calculatorId: SkyDateRangeCalculatorId.SpecificRange,
      startDate: 'asdf' as any,
      endDate: 'asdf' as any,
    };

    this.pickerFormControl.setValue(range);
  }

  public submit(): void {
    const value = this.reactiveForm.value;
    console.log('Form submitted with:', value);
  }

  public setDateFormat(): void {
    this.dateFormat = 'YYYY-MM-DD';
  }

  public toggleEndDateRequired(): void {
    this.endDateRequired = !this.endDateRequired;
  }

  public toggleStartDateRequired(): void {
    this.startDateRequired = !this.startDateRequired;
  }
}
