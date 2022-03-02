import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup } from '@angular/forms';

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
  public get dateRange(): AbstractControl {
    return this.reactiveForm.get('dateRange');
  }

  @ViewChild('dateRangePicker', {
    read: SkyDateRangePickerComponent,
  })
  public dateRangePicker: SkyDateRangePickerComponent;

  public calculatorIds: SkyDateRangeCalculatorId[];
  public dateFormat: string;
  public disableReactiveOnInit = false;
  public endDateRequired = false;
  public initialDisabled = false;
  public initialValue: SkyDateRangeCalculation;
  public label: string;
  public numValueChangeNotifications = 0;
  public reactiveForm: FormGroup;
  public startDateRequired = false;
  public templateDisable: boolean = undefined;

  private ngUnsubscribe = new Subject<void>();

  constructor(private formBuilder: FormBuilder) {}

  public ngOnInit(): void {
    this.reactiveForm = this.formBuilder.group({
      dateRange: [
        { value: this.initialValue, disabled: this.initialDisabled },
        [],
      ],
    });

    this.dateRange.valueChanges
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(() => {
        this.numValueChangeNotifications++;
      });

    if (this.disableReactiveOnInit) {
      this.reactiveForm.disable();
    }
  }

  public ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  public setCalculatorIdsAsync(): void {
    setTimeout(() => {
      this.calculatorIds = [SkyDateRangeCalculatorId.After];
    });
  }
}
