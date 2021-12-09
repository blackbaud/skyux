import { NgModule } from '@angular/core';

import { CommonModule } from '@angular/common';

import { FormsModule } from '@angular/forms';

import { SkyAffixModule, SkyOverlayModule } from '@skyux/core';

import { SkyI18nModule } from '@skyux/i18n';

import { SkyIconModule, SkyWaitModule } from '@skyux/indicators';

import { SkyThemeModule } from '@skyux/theme';

import { SkyDatepickerCalendarComponent } from './datepicker-calendar.component';

import { SkyDatepickerCalendarInnerComponent } from './datepicker-calendar-inner.component';

import { SkyDayPickerComponent } from './daypicker.component';

import { SkyMonthPickerComponent } from './monthpicker.component';

import { SkyYearPickerComponent } from './yearpicker.component';

import { SkyDatepickerComponent } from './datepicker.component';

import { SkyDatepickerInputDirective } from './datepicker-input.directive';

import { SkyFuzzyDatepickerInputDirective } from './datepicker-input-fuzzy.directive';
import { SkyDatetimeResourcesModule } from '../shared/sky-datetime-resources.module';
import { SkyDayPickerButtonComponent } from './daypicker-button.component';
import { SkyDayPickerCellComponent } from './daypicker-cell.component';
import { SkyPopoverModule } from '@skyux/popovers';
import { SkyDatepickerService } from './datepicker.service';

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
    CommonModule,
    SkyI18nModule,
    FormsModule,
    SkyIconModule,
    SkyDatetimeResourcesModule,
    SkyAffixModule,
    SkyOverlayModule,
    SkyThemeModule,
    SkyPopoverModule,
    SkyWaitModule,
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
