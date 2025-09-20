import { Component, ViewChild } from '@angular/core';

import { SkyDatepickerCalendarComponent } from '../calendar/datepicker-calendar.component';
import { SkyDatepickerCustomDate } from '../datepicker-custom-date';

@Component({
  selector: 'sky-datepicker-calendar-test',
  templateUrl: './datepicker-calendar.component.fixture.html',
  standalone: false,
})
export class DatepickerCalendarTestComponent {
  public customDates: SkyDatepickerCustomDate[] | undefined;

  public minDate: Date | undefined;

  public maxDate: Date | undefined;

  public startAtDate: Date | undefined;

  public selectedDate: any;

  public startingDay: number | undefined;

  @ViewChild(SkyDatepickerCalendarComponent)
  public datepicker!: SkyDatepickerCalendarComponent;
}
