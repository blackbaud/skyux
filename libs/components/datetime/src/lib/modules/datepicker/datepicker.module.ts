import { A11yModule } from '@angular/cdk/a11y';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SkyAffixModule } from '@skyux/core';
import { SkyFormErrorModule } from '@skyux/forms';
import { SkyIconModule } from '@skyux/icon';
import { SkyWaitModule } from '@skyux/indicators';
import { SkyPopoverModule } from '@skyux/popovers';
import { SkyThemeModule } from '@skyux/theme';

import { SkyDatetimeResourcesModule } from '../shared/sky-datetime-resources.module';

import { SkyDatepickerCalendarInnerComponent } from './datepicker-calendar-inner.component';
import { SkyDatepickerCalendarLabelPipe } from './datepicker-calendar-label.pipe';
import { SkyDatepickerCalendarComponent } from './datepicker-calendar.component';
import { SkyFuzzyDatepickerInputDirective } from './datepicker-input-fuzzy.directive';
import { SkyDatepickerInputDirective } from './datepicker-input.directive';
import { SkyDatepickerComponent } from './datepicker.component';
import { SkyDatepickerService } from './datepicker.service';
import { SkyDayPickerButtonComponent } from './daypicker-button.component';
import { SkyDayPickerCellComponent } from './daypicker-cell.component';
import { SkyDayPickerComponent } from './daypicker.component';
import { SkyMonthPickerComponent } from './monthpicker.component';
import { SkyYearPickerComponent } from './yearpicker.component';

@NgModule({
  declarations: [
    SkyDatepickerCalendarComponent,
    SkyDatepickerCalendarInnerComponent,
    SkyDayPickerComponent,
    SkyMonthPickerComponent,
    SkyYearPickerComponent,
    SkyDatepickerComponent,
    SkyDatepickerInputDirective,
    SkyFuzzyDatepickerInputDirective,
    SkyDayPickerCellComponent,
    SkyDayPickerButtonComponent,
  ],
  imports: [
    A11yModule,
    CommonModule,
    FormsModule,
    SkyIconModule,
    SkyDatepickerCalendarLabelPipe,
    SkyDatetimeResourcesModule,
    SkyAffixModule,
    SkyThemeModule,
    SkyPopoverModule,
    SkyWaitModule,
    SkyFormErrorModule,
  ],
  exports: [
    SkyDatepickerCalendarComponent,
    SkyDatepickerComponent,
    SkyDatepickerInputDirective,
    SkyFuzzyDatepickerInputDirective,
  ],
  providers: [SkyDatepickerService],
})
export class SkyDatepickerModule {}
