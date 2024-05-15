import { CommonModule } from '@angular/common';
import {
  ChangeDetectorRef,
  Component,
  Injectable,
  inject,
} from '@angular/core';
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
  SkyDateRangePickerModule2,
} from '@skyux/datetime';
import { SkyAppLocaleInfo, SkyAppLocaleProvider } from '@skyux/i18n';

import { BehaviorSubject, Observable, of } from 'rxjs';

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
    SkyDateRangePickerModule2,
  ],
  providers: [
    {
      provide: SkyAppLocaleProvider,
      useClass: MyLocaleProvider,
    },
  ],
  selector: 'app-date-range-picker-2',
  standalone: true,
  template: `<form [formGroup]="formGroup" (ngSubmit)="onSubmit()">
      <sky-date-range-picker
        formControlName="pto"
        stacked="true"
        [calculatorIds]="calculatorIds"
        [dateFormat]="dateFormat"
      />

      <button class="sky-btn sky-btn-default" type="submit">Submit</button>
    </form>

    <h3>Value</h3>
    <pre>{{ ptoControl.value | json }}</pre>

    <h3>Errors</h3>
    <pre>{{ ptoControl.errors | json }}</pre>

    <h3>Statuses</h3>
    <pre>
Dirty?   {{ ptoControl.dirty }}
Valid?   {{ ptoControl.valid }}
Touched? {{ ptoControl.touched }}
</pre>

    <div>
      <button type="button" (click)="changeValue()">Change value</button>
      <button type="button" (click)="changeCalculators()">
        Change calculators
      </button>
      <button type="button" (click)="setInvalidRange()">
        Set invalid range
      </button>
      <button type="button" (click)="toggleDisabled()">Toggle disabled</button>
      <button type="button" (click)="toggleRequired()">Toggle required</button>
      <button type="button" (click)="changeDateFormat()">
        Change date format
      </button>
      <button type="button" (click)="changeLocale()">Change locale</button>
      <button type="button" (click)="resetForm()">Reset form</button>
    </div> `,
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
      console.log('HOST VALUE CHANGE:', x);
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
      startDate: new Date('1/1/2013'),
      endDate: new Date('1/1/2012'),
    });
    this.ptoControl.markAsDirty();
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
