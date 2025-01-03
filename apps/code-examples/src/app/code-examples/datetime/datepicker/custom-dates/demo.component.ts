import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import {
  SkyDatepickerCalendarChange,
  SkyDatepickerCustomDate,
  SkyDatepickerModule,
} from '@skyux/datetime';
import { SkyInputBoxModule } from '@skyux/forms';

import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';

@Component({
  selector: 'app-demo',
  templateUrl: './demo.component.html',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SkyDatepickerModule,
    SkyInputBoxModule,
  ],
})
export class DemoComponent {
  protected formGroup: FormGroup;

  #formBuilder = inject(FormBuilder);

  constructor() {
    this.formGroup = this.#formBuilder.group({
      startDate: new FormControl(),
    });
  }

  protected onCalendarDateRangeChange(
    event: SkyDatepickerCalendarChange,
  ): void {
    if (event) {
      // Bind observable to `customDates` argument and simulate delay for async process to finish.
      // Normally, `getCustomDates()` would be replaced by an async call to fetch data.
      event.customDates = this.#getCustomDates(event).pipe(delay(2000));
    }
  }

  /**
   * Generate fake custom dates based on the date range returned from the event.
   * This is for demonstration purposes only.
   */
  #getCustomDates(
    event: SkyDatepickerCalendarChange,
  ): Observable<SkyDatepickerCustomDate[]> {
    const getNextDate = function (startDate: Date, daysToAdd: number): Date {
      const newDate = new Date(startDate);
      newDate.setDate(newDate.getDate() + daysToAdd);
      return newDate;
    };

    const customDates: SkyDatepickerCustomDate[] = [];
    customDates.push({
      date: event.startDate,
      disabled: false,
      keyDate: true,
      keyDateText: ['Onboarding meeting'],
    });

    customDates.push({
      date: getNextDate(event.startDate, 8),
      disabled: false,
      keyDate: true,
      keyDateText: ['Department all hands'],
    });

    customDates.push({
      date: getNextDate(event.startDate, 9),
      disabled: false,
      keyDate: true,
      keyDateText: ['Company retreat'],
    });

    customDates.push({
      date: getNextDate(event.startDate, 10),
      disabled: true,
      keyDate: true,
      keyDateText: ['Federal holiday'],
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
      keyDateText: ['New hire review due'],
    });

    customDates.push({
      date: getNextDate(event.startDate, 13),
      disabled: false,
      keyDate: true,
      keyDateText: ['Key note speaker', 'Focus group'],
    });

    customDates.push({
      date: event.endDate,
      disabled: false,
      keyDate: true,
      keyDateText: ['Customer lunch and learn'],
    });

    return of(customDates);
  }
}
