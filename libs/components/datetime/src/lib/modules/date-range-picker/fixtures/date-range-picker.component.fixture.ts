import {
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
  inject,
  input,
  model,
} from '@angular/core';
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

  public readonly calculatorIds = model<SkyDateRangeCalculatorId[] | undefined>(
    undefined,
  );
  public readonly dateFormat = input<string | undefined>(undefined);
  public readonly disableReactiveOnInit = input(false);
  public readonly label = input<string | undefined>(undefined);
  public readonly labelText = input<string | undefined>(undefined);
  public numValueChangeNotifications = 0;
  public reactiveForm: UntypedFormGroup;
  public readonly required = input(false);
  public readonly templateDisable = input<boolean | undefined>(undefined);
  public readonly helpKey = input<string | undefined>(undefined);
  public readonly hintText = input<string | undefined>(undefined);
  public readonly helpPopoverContent = input<string | undefined>(undefined);
  public readonly stacked = input<boolean | undefined>(undefined);

  readonly #formBuilder = inject(UntypedFormBuilder);
  #ngUnsubscribe = new Subject<void>();

  constructor() {
    this.reactiveForm = this.#formBuilder.group({
      dateRange: new UntypedFormControl(),
    });
  }

  public ngOnInit(): void {
    this.dateRange?.valueChanges
      .pipe(takeUntil(this.#ngUnsubscribe))
      .subscribe(() => {
        this.numValueChangeNotifications++;
      });

    if (this.disableReactiveOnInit()) {
      this.reactiveForm.disable();
    }
  }

  public ngOnDestroy(): void {
    this.#ngUnsubscribe.next();
    this.#ngUnsubscribe.complete();
  }

  public setCalculatorIdsAsync(): void {
    setTimeout(() => {
      this.calculatorIds.set([SkyDateRangeCalculatorId.After]);
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
