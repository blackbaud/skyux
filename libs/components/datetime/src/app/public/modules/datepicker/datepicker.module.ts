import {
  NgModule
} from '@angular/core';

import {
  CommonModule
} from '@angular/common';

import {
  FormsModule
} from '@angular/forms';

import {
  SkyI18nModule
} from '@skyux/i18n';

import {
  SkyDropdownModule
} from '@skyux/popovers';

import {
  SkyIconModule
} from '@skyux/indicators';

import {
  SkyDateTimeResourcesModule
} from '../shared/datetime-resources.module';

import {
  SkyDatepickerCalendarComponent
} from './datepicker-calendar.component';

import {
  SkyDatepickerCalendarInnerComponent
} from './datepicker-calendar-inner.component';

import {
  SkyDayPickerComponent
} from './daypicker.component';

import {
  SkyMonthPickerComponent
} from './monthpicker.component';

import {
  SkyYearPickerComponent
} from './yearpicker.component';

import {
  SkyDatepickerComponent
} from './datepicker.component';

import {
  SkyDatepickerConfigService
} from './datepicker-config.service';

import {
  SkyDatepickerInputDirective
} from './datepicker-input.directive';

@NgModule({
  declarations: [
    SkyDatepickerCalendarComponent,
    SkyDatepickerCalendarInnerComponent,
    SkyDayPickerComponent,
    SkyMonthPickerComponent,
    SkyYearPickerComponent,
    SkyDatepickerComponent,
    SkyDatepickerInputDirective
  ],
  imports: [
    CommonModule,
    SkyI18nModule,
    SkyDropdownModule,
    FormsModule,
    SkyIconModule,
    SkyDateTimeResourcesModule
  ],
  exports: [
    SkyDatepickerCalendarComponent,
    SkyDatepickerCalendarInnerComponent,
    SkyDayPickerComponent,
    SkyMonthPickerComponent,
    SkyYearPickerComponent,
    SkyDatepickerComponent,
    SkyDatepickerInputDirective
  ],
  providers: [
    SkyDatepickerConfigService
  ]
})
export class SkyDatepickerModule { }
