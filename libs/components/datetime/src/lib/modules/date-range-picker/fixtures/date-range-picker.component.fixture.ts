import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import {
  AbstractControl,
  FormsModule,
  ReactiveFormsModule,
  UntypedFormBuilder,
  UntypedFormControl,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { SkyDateRangePickerComponent } from '../date-range-picker.component';
import { SkyDateRangePickerModule } from '../date-range-picker.module';
import { SkyDateRangeCalculatorId } from '../types/date-range-calculator-id';

@Component({
  imports: [FormsModule, ReactiveFormsModule, SkyDateRangePickerModule],
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
  public label: string | undefined;
  public labelText: string | undefined;
  public numValueChangeNotifications = 0;
  public reactiveForm: UntypedFormGroup;
  public required = false;
  public templateDisable: boolean | undefined;
  public helpKey: string | undefined;
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

  public setFormControlRequired(required: boolean): void {
    if (required) {
      this.dateRange?.addValidators(Validators.required);
    } else {
      this.dateRange?.removeValidators(Validators.required);
    }

    this.dateRange?.updateValueAndValidity();
  }
}
