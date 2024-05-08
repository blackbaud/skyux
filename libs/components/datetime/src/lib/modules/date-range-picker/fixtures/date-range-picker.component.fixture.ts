import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import {
  AbstractControl,
  UntypedFormBuilder,
  UntypedFormControl,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { SkyDateRangePickerComponent } from '../date-range-picker.component';
import { SkyDateRangeCalculation } from '../types/date-range-calculation';
import { SkyDateRangeCalculatorId } from '../types/date-range-calculator-id';

@Component({
  selector: 'sky-date-range-picker-test',
  templateUrl: './date-range-picker.component.fixture.html',
})
export class DateRangePickerTestComponent implements OnInit, OnDestroy {
  public get dateRange(): AbstractControl | undefined | null {
    return this.reactiveForm.get('dateRange');
  }

  @ViewChild('dateRangePicker', {
    read: SkyDateRangePickerComponent,
  })
  public dateRangePicker!: SkyDateRangePickerComponent;

  public calculatorIds: SkyDateRangeCalculatorId[] | undefined;
  public dateFormat: string | undefined;
  public disableReactiveOnInit = false;
  public endDateRequired = false;
  public label: string | undefined;
  public numValueChangeNotifications = 0;
  public reactiveForm: UntypedFormGroup;
  public templateModel: SkyDateRangeCalculation | undefined = undefined;
  public templateRequired = false;
  public startDateRequired = false;
  public templateDisable: boolean | undefined;
  public hintText: string | undefined;
  public helpPopoverContent: string | undefined;
  public stacked: boolean | undefined;

  #ngUnsubscribe = new Subject<void>();

  constructor(formBuilder: UntypedFormBuilder) {
    this.reactiveForm = formBuilder.group({
      dateRange: new UntypedFormControl(),
    });
  }

  public ngOnInit(): void {
    this.dateRange?.valueChanges
      .pipe(takeUntil(this.#ngUnsubscribe))
      .subscribe(() => {
        this.numValueChangeNotifications++;
      });

    if (this.disableReactiveOnInit) {
      this.reactiveForm.disable();
    }
  }

  public ngOnDestroy(): void {
    this.#ngUnsubscribe.next();
    this.#ngUnsubscribe.complete();
  }

  public setCalculatorIdsAsync(): void {
    setTimeout(() => {
      this.calculatorIds = [SkyDateRangeCalculatorId.After];
    });
  }

  public setRequired(required = false): void {
    if (required) {
      this.dateRange?.addValidators(Validators.required);
      this.templateRequired = true;
    } else {
      this.dateRange?.removeValidators(Validators.required);
      this.templateRequired = false;
    }
    this.dateRange?.updateValueAndValidity();
  }
}
