import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
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

@Component({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SkyDateRangePickerModule2,
  ],
  selector: 'app-date-range-picker-2',
  standalone: true,
  template: `<form [formGroup]="formGroup" (ngSubmit)="onSubmit()">
      <sky-date-range-picker
        formControlName="pto"
        stacked="true"
        [calculatorIds]="calculatorIds"
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
      <button type="button" (click)="toggleDisabled()">Toggle disabled</button>
      <button type="button" (click)="toggleRequired()">Toggle required</button>
      <button type="button" (click)="resetForm()">Reset form</button>
    </div> `,
})
export class DateRangePickerComponent {
  protected calculatorIds: SkyDateRangeCalculatorId[] | undefined;

  protected formGroup = inject(FormBuilder).group({
    pto: new FormControl<SkyDateRangeCalculation>(undefined, []),
  });

  protected get ptoControl(): AbstractControl {
    return this.formGroup.get('pto') as AbstractControl;
  }

  constructor() {
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

  protected changeValue(): void {
    this.ptoControl.setValue({ calculatorId: 5 });
  }

  protected onSubmit(): void {
    this.formGroup.markAllAsTouched();
    this.formGroup.markAsDirty();
  }

  protected resetForm(): void {
    this.calculatorIds = undefined;
    this.formGroup.reset();
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
