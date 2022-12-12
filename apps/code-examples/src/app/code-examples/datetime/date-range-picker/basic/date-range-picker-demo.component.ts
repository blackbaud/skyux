import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  UntypedFormControl,
  UntypedFormGroup,
} from '@angular/forms';
import {
  SkyDateRangeCalculation,
  SkyDateRangeCalculatorId,
  SkyDateRangeCalculatorType,
  SkyDateRangeService,
} from '@skyux/datetime';

import { Subject } from 'rxjs';
import { distinctUntilChanged, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-date-range-picker-demo',
  templateUrl: './date-range-picker-demo.component.html',
})
export class DateRangePickerDemoComponent implements OnInit, OnDestroy {
  public calculatorIds: SkyDateRangeCalculatorId[] | undefined;

  public dateFormat: string | undefined;

  public reactiveForm: UntypedFormGroup;

  public get reactiveRange(): AbstractControl | null {
    return this.reactiveForm.get('lastDonation');
  }

  #ngUnsubscribe = new Subject<void>();

  #dateRangeService: SkyDateRangeService;

  constructor(dateRangeService: SkyDateRangeService, formBuilder: FormBuilder) {
    this.#dateRangeService = dateRangeService;
    this.reactiveForm = formBuilder.group({
      lastDonation: new UntypedFormControl(),
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

  public toggleDisabled(): void {
    if (this.reactiveForm.disabled) {
      this.reactiveForm.enable();
    } else {
      this.reactiveForm.disable();
    }
  }

  public resetForm(): void {
    this.dateFormat = undefined;
    this.calculatorIds = undefined;
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

    this.reactiveRange?.setValue(range);
  }

  public setInvalidRange(): void {
    const range: SkyDateRangeCalculation = {
      calculatorId: SkyDateRangeCalculatorId.SpecificRange,
      startDate: new Date('1/1/2013'),
      endDate: new Date('1/1/2012'),
    };

    this.reactiveRange?.setValue(range);
  }

  public setInvalidDates(): void {
    const range: SkyDateRangeCalculation = {
      calculatorId: SkyDateRangeCalculatorId.SpecificRange,
      startDate: 'invalid' as never as Date,
      endDate: 'invalid' as never as Date,
    };

    this.reactiveRange?.setValue(range);
  }

  public setCalculatorIds(): void {
    const calculator = this.#dateRangeService.createCalculator({
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

  public setDateFormat(): void {
    this.dateFormat = 'YYYY-MM-DD';
  }
}
