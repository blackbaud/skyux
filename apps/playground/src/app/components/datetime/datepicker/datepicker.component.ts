import { Component, OnInit } from '@angular/core';

import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import {
  SkyDatepickerCalendarChange,
  SkyDatepickerCustomDate,
} from '@skyux/datetime';
import { of } from 'rxjs';

import { delay, distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'app-datepicker',
  templateUrl: './datepicker.component.html',
})
export class DatepickerComponent implements OnInit {
  public disabled = false;
  public minDate: Date | undefined;
  public maxDate: Date | undefined;
  public noValidate = false;
  public reactiveForm: FormGroup | undefined;
  public showCustomDates = false;
  public selectedDate: Date = new Date(1955, 10, 5);
  public startingDay: number | undefined;
  public strict = false;

  constructor(private formBuilder: FormBuilder) {}

  public get reactiveDate(): AbstractControl {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return this.reactiveForm!.get('selectedDate')!;
  }

  public ngOnInit(): void {
    this.reactiveForm = this.formBuilder.group({
      selectedDate: new FormControl(new Date(1955, 10, 5), Validators.required),
    });

    this.reactiveDate.statusChanges
      .pipe(distinctUntilChanged())
      .subscribe((status: any) => {
        console.log('Status changed:', status);
      });

    this.reactiveDate.valueChanges.subscribe((value: any) => {
      console.log('Value changed:', value);
    });
  }

  public setMinMaxDates(): void {
    this.minDate = new Date('01/01/2018');
    this.maxDate = new Date('01/01/2020');
  }

  public setStartingDay(): void {
    this.startingDay = 1;
  }

  public toggleDisabled(): void {
    if (this.reactiveDate.disabled) {
      this.reactiveDate.enable();
    } else {
      this.reactiveDate.disable();
    }

    this.disabled = !this.disabled;
  }

  public setReactiveDate(emitEvent = true) {
    this.reactiveDate.setValue(new Date('12/12/2012'), {
      emitEvent: emitEvent,
    });
  }

  public setReactiveString(emitEvent = true) {
    this.reactiveDate.setValue('12/12/2012', { emitEvent: emitEvent });
  }

  public setValue(): void {
    this.reactiveDate.setValue(new Date('2/2/2001'));
    this.selectedDate = new Date('2/2/2001');
  }

  public setInvalidValue(): void {
    this.reactiveDate.setValue('invalid');
    (this.selectedDate as any) = 'invalid';
  }

  public onToggleCustomDatesClick(): void {
    this.showCustomDates = !this.showCustomDates;
  }

  public onCalendarDateRangeChange(range: SkyDatepickerCalendarChange): void {
    this.updateCustomDates(range);
  }

  /**
   * Simulate an async call to fetch data and add custom "key" dates to the current date range.
   */
  public updateCustomDates(event: SkyDatepickerCalendarChange): void {
    if (this.showCustomDates && event) {
      const customDates: SkyDatepickerCustomDate[] = [];
      customDates.push({
        date: event.startDate,
        disabled: false,
        keyDate: true,
        keyDateText: ['First date'],
      });

      customDates.push({
        date: this.getNextDate(event.startDate, 8),
        disabled: false,
        keyDate: true,
        keyDateText: ['Important'],
      });

      customDates.push({
        date: this.getNextDate(event.startDate, 9),
        disabled: false,
        keyDate: true,
        keyDateText: ['Also Important'],
      });

      customDates.push({
        date: this.getNextDate(event.startDate, 10),
        disabled: true,
        keyDate: true,
        keyDateText: ['Disabled'],
      });

      customDates.push({
        date: this.getNextDate(event.startDate, 11),
        disabled: true,
        keyDate: false,
        keyDateText: [],
      });

      customDates.push({
        date: this.getNextDate(event.startDate, 12),
        disabled: false,
        keyDate: true,
        keyDateText: [],
      });

      customDates.push({
        date: this.getNextDate(event.startDate, 13),
        disabled: false,
        keyDate: true,
        keyDateText: ['Multiple', 'Messages'],
      });

      customDates.push({
        date: event.endDate,
        disabled: false,
        keyDate: true,
        keyDateText: ['Last date'],
      });

      // Bind observable to event argument and simulate async call.
      event.customDates = of(customDates).pipe(delay(2000));
    }
  }

  public getNextDate(startDate: Date, daystoAdd: number): Date {
    let newDate = new Date(startDate);
    newDate.setDate(newDate.getDate() + daystoAdd);
    return newDate;
  }
}
