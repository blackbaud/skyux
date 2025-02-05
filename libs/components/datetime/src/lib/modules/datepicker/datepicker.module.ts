import { NgModule } from '@angular/core';

import { SkyDatepickerCalendarInnerComponent } from './calendar/datepicker-calendar-inner.component';
import { SkyDatepickerCalendarComponent } from './calendar/datepicker-calendar.component';
import { SkyDatepickerCalendarService } from './calendar/datepicker-calendar.service';
import { SkyDayPickerButtonComponent } from './calendar/daypicker-button.component';
import { SkyDayPickerCellComponent } from './calendar/daypicker-cell.component';
import { SkyDayPickerComponent } from './calendar/daypicker.component';
import { SkyMonthPickerComponent } from './calendar/monthpicker.component';
import { SkyYearPickerComponent } from './calendar/yearpicker.component';
import { SkyDatepickerInputDirective } from './datepicker-input.directive';
import { SkyDatepickerComponent } from './datepicker.component';
import { SkyFuzzyDatepickerInputDirective } from './fuzzy/datepicker-input-fuzzy.directive';

@NgModule({
  imports: [
    SkyDatepickerCalendarComponent,
    SkyDatepickerCalendarInnerComponent,
    SkyDatepickerComponent,
    SkyDatepickerInputDirective,
    SkyDayPickerButtonComponent,
    SkyDayPickerCellComponent,
    SkyDayPickerComponent,
    SkyFuzzyDatepickerInputDirective,
    SkyMonthPickerComponent,
    SkyYearPickerComponent,
  ],
  exports: [
    SkyDatepickerCalendarComponent,
    SkyDatepickerComponent,
    SkyDatepickerInputDirective,
    SkyFuzzyDatepickerInputDirective,
  ],
  providers: [SkyDatepickerCalendarService],
})
export class SkyDatepickerModule {}
