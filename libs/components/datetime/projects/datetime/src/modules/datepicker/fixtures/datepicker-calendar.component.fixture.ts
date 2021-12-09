import { Component, ViewChild } from '@angular/core';
import { SkyDatepickerCustomDate } from '../datepicker-custom-date';

import { SkyDatepickerCalendarComponent } from '../datepicker-calendar.component';

@Component({
  selector: 'sky-datepicker-calendar-test',
  templateUrl: './datepicker-calendar.component.fixture.html',
})
export class DatepickerCalendarTestComponent {
  public customDates: SkyDatepickerCustomDate[];

  public minDate: Date;

  public maxDate: Date;

  public selectedDate: any;

  public startingDay: number;

  @ViewChild(SkyDatepickerCalendarComponent)
  public datepicker: SkyDatepickerCalendarComponent;
}
