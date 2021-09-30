import {
  NgModule
} from '@angular/core';

import {
  FormsModule,
  ReactiveFormsModule
} from '@angular/forms';

import {
  NoopAnimationsModule
} from '@angular/platform-browser/animations';

import {
  SkyDatepickerModule
} from '../datepicker.module';

import {
  SkyFuzzyDateService
} from '../fuzzy-date.service';

import {
  DatepickerCalendarTestComponent
} from './datepicker-calendar.component.fixture';

import {
  FuzzyDatepickerTestComponent
} from './fuzzy-datepicker.component.fixture';

import {
  FuzzyDatepickerNoFormatTestComponent
} from './fuzzy-datepicker-noformat.component.fixture';

import {
  FuzzyDatepickerReactiveTestComponent
} from './fuzzy-datepicker-reactive.component.fixture';

@NgModule({
  declarations: [
    DatepickerCalendarTestComponent,
    FuzzyDatepickerNoFormatTestComponent,
    FuzzyDatepickerReactiveTestComponent,
    FuzzyDatepickerTestComponent
  ],
  imports: [
    SkyDatepickerModule,
    NoopAnimationsModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [
    SkyFuzzyDateService
  ],
  exports: [
    DatepickerCalendarTestComponent,
    FuzzyDatepickerNoFormatTestComponent,
    FuzzyDatepickerReactiveTestComponent,
    FuzzyDatepickerTestComponent
  ]
})
export class FuzzyDatepickerTestModule { }
