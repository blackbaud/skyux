import { CommonModule } from '@angular/common';
import { Component, Injectable, inject } from '@angular/core';
import {
  AbstractControl,
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
import { SkyAppLocaleInfo, SkyAppLocaleProvider } from '@skyux/i18n';

import { BehaviorSubject, Observable } from 'rxjs';

@Injectable()
class MyLocaleProvider extends SkyAppLocaleProvider {
  #locale: BehaviorSubject<SkyAppLocaleInfo>;
  #localeObs: Observable<SkyAppLocaleInfo>;

  constructor() {
    super();

    this.#locale = new BehaviorSubject<SkyAppLocaleInfo>({
      locale: 'en-US',
    });

    this.#localeObs = this.#locale.asObservable();
  }

  public override getLocaleInfo(): Observable<SkyAppLocaleInfo> {
    return this.#localeObs;
  }

  public setLocale(locale: string): void {
    this.#locale.next({ locale });
  }
}

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
      useClass: MyLocaleProvider,
    },
  ],
  selector: 'app-date-range-picker',
  standalone: true,
  templateUrl: './date-range-picker.component.html',
})
export class DateRangePickerComponent {
  protected calculatorIds: SkyDateRangeCalculatorId[] | undefined;
  protected dateFormat: string | undefined;

  protected formGroup = inject(FormBuilder).group({
    pto: new FormControl<SkyDateRangeCalculation>(undefined, [
      Validators.required,
    ]),
  });

  protected get ptoControl(): AbstractControl {
    return this.formGroup.get('pto') as AbstractControl;
  }

  readonly #localeProvider = inject(SkyAppLocaleProvider) as MyLocaleProvider;

  constructor() {
    // this.ptoControl.setValue({
    //   calculatorId: SkyDateRangeCalculatorId.SpecificRange,
    //   startDate: new Date('1/2/2000'),
    //   endDate: new Date('1/1/2000'),
    // });

    this.ptoControl.statusChanges.subscribe((x) => {
      console.log('HOST STATUS CHANGE:', x);
    });

    this.ptoControl.valueChanges.subscribe((x) => {
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
    // this.ptoControl.setValue({ calculatorId: 5 }, { emitEvent: false });
    this.ptoControl.patchValue({ endDate: new Date() });
    // this.ptoControl.patchValue({ calculatorId: 5 });
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
    this.ptoControl.setValue({
      calculatorId: SkyDateRangeCalculatorId.SpecificRange,
      startDate: new Date('1/2/2012'),
      endDate: new Date('1/1/2012'),
    });
    this.ptoControl.markAsDirty();
  }

  protected setUndefined(): void {
    this.ptoControl.setValue(undefined);
  }

  protected toggleDisabled(): void {
    if (this.ptoControl.disabled) {
      this.ptoControl.enable();
    } else {
      this.ptoControl.disable();
    }
  }

  protected toggleRequired(): void {
    if (this.ptoControl.hasValidator(Validators.required)) {
      this.ptoControl.removeValidators(Validators.required);
    } else {
      this.ptoControl.addValidators(Validators.required);
    }
    this.ptoControl.updateValueAndValidity();
  }
}
