import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import {
  SkyDatepickerCalendarChange,
  SkyDatepickerCustomDate,
} from '@skyux/datetime';

import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';

@Component({
  selector: 'app-datepicker-demo',
  templateUrl: './datepicker-demo.component.html',
})
export class DatepickerDemoComponent implements OnInit {
  public myForm: FormGroup;

  constructor(private formBuilder: FormBuilder) {}

  public ngOnInit(): void {
    this.myForm = this.formBuilder.group({
      myDate: new FormControl(new Date(1999, 10, 5)),
    });
  }

  public onCalendarDateRangeChange(event: SkyDatepickerCalendarChange): void {
    if (event) {
      // Bind observable to `customDates` argument and simulate delay for async process to finish.
      // Normally, `getCustomDates()` would be replaced by an async call to fetch data.
      event.customDates = this.getCustomDates(event).pipe(delay(2000));
    }
  }

  /**
   * Generate fake custom dates based on the date range returned from the event.
   * This is for demonstration purposes only.
   */
  private getCustomDates(
    event: SkyDatepickerCalendarChange
  ): Observable<SkyDatepickerCustomDate[]> {
    const getNextDate = function (startDate: Date, daystoAdd: number): Date {
      const newDate = new Date(startDate);
      newDate.setDate(newDate.getDate() + daystoAdd);
      return newDate;
    };

    const customDates: SkyDatepickerCustomDate[] = [];
    customDates.push({
      date: event.startDate,
      disabled: false,
      keyDate: true,
      keyDateText: ['First date'],
    });

    customDates.push({
      date: getNextDate(event.startDate, 8),
      disabled: false,
      keyDate: true,
      keyDateText: ['Important'],
    });

    customDates.push({
      date: getNextDate(event.startDate, 9),
      disabled: false,
      keyDate: true,
      keyDateText: ['Also Important'],
    });

    customDates.push({
      date: getNextDate(event.startDate, 10),
      disabled: true,
      keyDate: true,
      keyDateText: ['Disabled'],
    });

    customDates.push({
      date: getNextDate(event.startDate, 11),
      disabled: true,
      keyDate: false,
      keyDateText: [],
    });

    customDates.push({
      date: getNextDate(event.startDate, 12),
      disabled: false,
      keyDate: true,
      keyDateText: [],
    });

    customDates.push({
      date: getNextDate(event.startDate, 13),
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

    return of(customDates);
  }
}
