import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  SkyDateRangeCalculation,
  SkyDateRangeCalculatorId,
  SkyDateRangePickerModule,
} from '@skyux/datetime';
import { SkyAppLocaleProvider } from '@skyux/i18n';

import { LocaleProvider } from './locale-provider';

@Component({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SkyDateRangePickerModule,
  ],
  providers: [
    {
      provide: SkyAppLocaleProvider,
      useClass: LocaleProvider,
    },
  ],
  selector: 'app-date-range-picker',
  standalone: true,
  templateUrl: './date-range-picker.component.html',
})
export class DateRangePickerComponent {
  protected calculatorIds: SkyDateRangeCalculatorId[] | undefined;
  protected dateFormat: string | undefined;
  protected hintText: string | undefined;
  protected lastDonationControl = new FormControl<SkyDateRangeCalculation>({
    calculatorId: SkyDateRangeCalculatorId.Today,
  });

  protected formGroup = inject(FormBuilder).group({
    lastDonation: this.lastDonationControl,
  });

  readonly #localeProvider = inject(SkyAppLocaleProvider) as LocaleProvider;

  constructor() {
    this.lastDonationControl.statusChanges.subscribe((x) => {
      console.log('HOST STATUS CHANGE:', x);
    });

    this.lastDonationControl.valueChanges.subscribe((x) => {
      console.log('HOST VALUE CHANGE:', JSON.stringify(x));
    });
  }

  protected changeCalculators(): void {
    this.calculatorIds = [
      SkyDateRangeCalculatorId.LastCalendarYear,
      SkyDateRangeCalculatorId.ThisCalendarYear,
      SkyDateRangeCalculatorId.NextCalendarYear,
      SkyDateRangeCalculatorId.LastFiscalYear,
      SkyDateRangeCalculatorId.ThisFiscalYear,
      SkyDateRangeCalculatorId.NextFiscalYear,
    ];
  }

  protected changeDateFormat(): void {
    this.dateFormat = 'YYYY/MM/DD';
  }

  protected changeLocale(): void {
    this.#localeProvider.setLocale('en-GB');
  }

  protected changeValue(): void {
    this.lastDonationControl.patchValue({ calculatorId: 5 });
  }

  protected onSubmit(): void {
    this.formGroup.markAllAsTouched();
    this.formGroup.markAsDirty();
  }

  protected resetForm(): void {
    this.calculatorIds = undefined;
    this.formGroup.reset();
  }

  protected setInvalidRange(): void {
    this.lastDonationControl.setValue({
      calculatorId: SkyDateRangeCalculatorId.SpecificRange,
      startDate: new Date('1/2/2012'),
      endDate: new Date('1/1/2012'),
    });

    this.lastDonationControl.markAsTouched();
  }

  protected setUndefined(): void {
    this.lastDonationControl.setValue(undefined);
  }

  protected setValidRange(): void {
    this.lastDonationControl.setValue({
      calculatorId: SkyDateRangeCalculatorId.SpecificRange,
      startDate: new Date('2024/10/1'),
      endDate: new Date('2024/10/31'),
    });
  }

  protected toggleDisabled(): void {
    if (this.lastDonationControl.disabled) {
      this.lastDonationControl.enable();
    } else {
      this.lastDonationControl.disable();
    }
  }

  protected toggleHintText(): void {
    if (this.hintText) {
      this.hintText = undefined;
    } else {
      this.hintText =
        'Really long hint text that should wrap and be confined to below the date range picker element. We set the text to have a small margin below the selection and datepicker controls, and if there are any errors (shown below) there will be a slight spacing between this element and those errors.';
    }
  }

  protected toggleRequired(): void {
    if (this.lastDonationControl.hasValidator(Validators.required)) {
      this.lastDonationControl.removeValidators(Validators.required);
    } else {
      this.lastDonationControl.addValidators(Validators.required);
    }
    this.lastDonationControl.updateValueAndValidity();
  }
}
