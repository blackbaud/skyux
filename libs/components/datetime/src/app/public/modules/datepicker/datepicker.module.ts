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
  SkyAffixModule,
  SkyAppWindowRef,
  SkyCoreAdapterService,
  SkyOverlayModule
} from '@skyux/core';

import {
  SkyI18nModule
} from '@skyux/i18n';

import {
  SkyIconModule
} from '@skyux/indicators';

import {
  SkyThemeModule,
  SkyThemeService
} from '@skyux/theme';

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

import {
  SkyFuzzyDatepickerInputDirective
} from './datepicker-input-fuzzy.directive';

import {
  SkyFuzzyDateService
} from './fuzzy-date.service';

@NgModule({
  declarations: [
    SkyDatepickerCalendarComponent,
    SkyDatepickerCalendarInnerComponent,
    SkyDayPickerComponent,
    SkyMonthPickerComponent,
    SkyYearPickerComponent,
    SkyDatepickerComponent,
    SkyDatepickerInputDirective,
    SkyFuzzyDatepickerInputDirective
  ],
  imports: [
    CommonModule,
    SkyI18nModule,
    FormsModule,
    SkyIconModule,
    SkyDateTimeResourcesModule,
    SkyAffixModule,
    SkyOverlayModule,
    SkyThemeModule
  ],
  exports: [
    SkyDatepickerCalendarComponent,
    SkyDatepickerCalendarInnerComponent,
    SkyDayPickerComponent,
    SkyMonthPickerComponent,
    SkyYearPickerComponent,
    SkyDatepickerComponent,
    SkyDatepickerInputDirective,
    SkyFuzzyDatepickerInputDirective
  ],
  providers: [
    SkyAppWindowRef,
    SkyDatepickerConfigService,
    SkyFuzzyDateService,
    SkyCoreAdapterService,
    SkyThemeService
  ]
})
export class SkyDatepickerModule { }
