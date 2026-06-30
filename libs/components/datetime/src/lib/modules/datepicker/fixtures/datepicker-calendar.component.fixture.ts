import { Component, ViewChild, input, model } from '@angular/core';

import { SkyDatepickerCalendarComponent } from '../calendar/datepicker-calendar.component';
import { SkyDatepickerCustomDate } from '../datepicker-custom-date';

@Component({
  selector: 'sky-datepicker-calendar-test',
  templateUrl: './datepicker-calendar.component.fixture.html',
  standalone: false,
})
export class DatepickerCalendarTestComponent {
  public customDates = input<SkyDatepickerCustomDate[] | undefined>(undefined);

  public minDate = input<Date | undefined>(undefined);

  public maxDate = input<Date | undefined>(undefined);

  public startAtDate = input<Date | undefined>(undefined);

  public selectedDate = model<any>(undefined);

  public startingDay = input<number | undefined>(undefined);

  @ViewChild(SkyDatepickerCalendarComponent)
  public datepicker!: SkyDatepickerCalendarComponent;
}
