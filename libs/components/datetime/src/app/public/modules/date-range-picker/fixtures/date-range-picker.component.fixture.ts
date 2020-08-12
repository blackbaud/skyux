import {
  Component,
  OnDestroy,
  OnInit,
  ViewChild
} from '@angular/core';

import {
  AbstractControl,
  FormBuilder,
  FormGroup
} from '@angular/forms';

import {
  Subject
} from 'rxjs';

import {
  takeUntil
} from 'rxjs/operators';

import {
  SkyDateRangeCalculation
} from '../types/date-range-calculation';

import {
  SkyDateRangeCalculatorId
} from '../types/date-range-calculator-id';

import {
  SkyDateRangePickerComponent
} from '../date-range-picker.component';

@Component({
  selector: 'date-range-picker-test',
  templateUrl: './date-range-picker.component.fixture.html'
})
export class DateRangePickerTestComponent implements OnInit, OnDestroy {
  public get dateRange(): AbstractControl {
    return this.reactiveForm.get('dateRange');
  }

  @ViewChild('dateRangePicker', {
    read: SkyDateRangePickerComponent
  })
  public dateRangePicker: SkyDateRangePickerComponent;

  public calculatorIds: SkyDateRangeCalculatorId[];
  public dateFormat: string;
  public initialDisabled: boolean = false;
  public initialValue: SkyDateRangeCalculation;
  public label: string;
  public numValueChangeNotifications = 0;
  public reactiveForm: FormGroup;

  private ngUnsubscribe = new Subject<void>();

  constructor(
    private formBuilder: FormBuilder
  ) {}

  public ngOnInit(): void {
    this.reactiveForm = this.formBuilder.group({
      dateRange: [{ value: this.initialValue, disabled: this.initialDisabled }, []]
    });

    this.dateRange.valueChanges
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(() => {
        this.numValueChangeNotifications++;
      });
  }

  public ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  public setCalculatorIdsAsync(): void {
    setTimeout(() => {
      this.calculatorIds = [
        SkyDateRangeCalculatorId.After
      ];
    });
  }
}
