import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import {
  SkyDateRangeCalculation,
  SkyDateRangeCalculatorId,
  SkyDateRangeCalculatorType,
  SkyDateRangePickerModule,
  SkyDateRangeService,
} from '@skyux/datetime';

import { Subject } from 'rxjs';
import { distinctUntilChanged, takeUntil } from 'rxjs/operators';

@Component({
  standalone: true,
  selector: 'app-demo',
  templateUrl: './demo.component.html',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SkyDateRangePickerModule,
  ],
})
export class DemoComponent implements OnInit, OnDestroy {
  protected get reactiveRange(): AbstractControl | null {
    return this.formGroup.get('lastDonation');
  }

  protected calculatorIds: SkyDateRangeCalculatorId[] | undefined;
  protected dateFormat: string | undefined;
  protected formGroup: FormGroup;

  #ngUnsubscribe = new Subject<void>();

  readonly #dateRangeSvc = inject(SkyDateRangeService);
  readonly #formBuilder = inject(FormBuilder);

  constructor() {
    this.formGroup = this.#formBuilder.group({
      lastDonation: new FormControl(),
    });
  }

  public ngOnInit(): void {
    // Watch for status changes.
    this.reactiveRange?.statusChanges
      .pipe(distinctUntilChanged(), takeUntil(this.#ngUnsubscribe))
      .subscribe((status) => {
        console.log(
          'Date range status change:',
          status,
          this.reactiveRange?.errors
        );
      });

    // Watch for value changes.
    this.reactiveRange?.valueChanges
      .pipe(distinctUntilChanged(), takeUntil(this.#ngUnsubscribe))
      .subscribe((value: SkyDateRangeCalculation) => {
        console.log('Date range value change:', value);
      });
  }

  public ngOnDestroy(): void {
    this.#ngUnsubscribe.next();
    this.#ngUnsubscribe.complete();
  }

  protected toggleDisabled(): void {
    if (this.formGroup.disabled) {
      this.formGroup.enable();
    } else {
      this.formGroup.disable();
    }
  }

  protected resetForm(): void {
    this.dateFormat = undefined;
    this.calculatorIds = undefined;
    this.formGroup.reset();
    this.formGroup.markAsPristine();
    this.formGroup.markAsUntouched();
  }

  protected setRange(): void {
    const range: SkyDateRangeCalculation = {
      calculatorId: SkyDateRangeCalculatorId.SpecificRange,
      startDate: new Date('1/1/2012'),
      endDate: new Date('1/1/2013'),
    };

    this.reactiveRange?.setValue(range);
  }

  protected setInvalidRange(): void {
    const range: SkyDateRangeCalculation = {
      calculatorId: SkyDateRangeCalculatorId.SpecificRange,
      startDate: new Date('1/1/2013'),
      endDate: new Date('1/1/2012'),
    };

    this.reactiveRange?.setValue(range);
  }

  protected setInvalidDates(): void {
    const range: SkyDateRangeCalculation = {
      calculatorId: SkyDateRangeCalculatorId.SpecificRange,
      startDate: 'invalid' as never as Date,
      endDate: 'invalid' as never as Date,
    };

    this.reactiveRange?.setValue(range);
  }

  protected setCalculatorIds(): void {
    const calculator = this.#dateRangeSvc.createCalculator({
      shortDescription: 'Since 1999',
      type: SkyDateRangeCalculatorType.Relative,
      getValue: () => {
        return {
          startDate: new Date('1/1/1999'),
          endDate: new Date(),
        };
      },
    });

    this.calculatorIds = [
      calculator.calculatorId,
      SkyDateRangeCalculatorId.SpecificRange,
      SkyDateRangeCalculatorId.LastFiscalYear,
    ];
  }

  protected setDateFormat(): void {
    this.dateFormat = 'YYYY-MM-DD';
  }
}
