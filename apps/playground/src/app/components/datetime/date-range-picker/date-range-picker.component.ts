import { ChangeDetectorRef, Component, inject } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  UntypedFormBuilder,
  UntypedFormControl,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import {
  SkyDateRangeCalculation,
  SkyDateRangeCalculatorId,
} from '@skyux/datetime';

@Component({
  selector: 'app-date-range-picker',
  templateUrl: './date-range-picker.component.html',
  styleUrls: ['./date-range-picker.component.scss'],
})
export class DateRangePickerComponent {
  public calculatorIds: SkyDateRangeCalculatorId[];
  public dateFormat: string;
  public disabled = false;
  public endDateRequired = false;
  public reactiveForm: UntypedFormGroup;
  public startDateRequired = false;

  readonly #changeDetector = inject(ChangeDetectorRef);
  #required = false;

  public get pickerFormControl(): AbstractControl {
    return this.reactiveForm.get('lastDonation');
  }

  constructor(formBuilder: UntypedFormBuilder) {
    this.reactiveForm = formBuilder.group({
      firstName: new FormControl<string>(''),
      lastDonation: new UntypedFormControl(),
    });
    this.pickerFormControl.statusChanges.subscribe((status) => {
      console.log(
        'Date range status change:',
        status,
        this.pickerFormControl.errors,
      );
      this.#changeDetector.detectChanges();
    });

    this.pickerFormControl.valueChanges.subscribe((value) => {
      console.log('Date range value change:', value);
      this.#changeDetector.detectChanges();
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

  public toggleRequiredDate(): void {
    if (this.#required) {
      this.pickerFormControl.removeValidators(Validators.required);
    } else {
      this.pickerFormControl.addValidators(Validators.required);
    }
    this.pickerFormControl.updateValueAndValidity();
    this.#required = !this.#required;
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
