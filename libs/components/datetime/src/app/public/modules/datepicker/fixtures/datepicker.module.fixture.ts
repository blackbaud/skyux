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
  DatepickerCalendarTestComponent
} from './datepicker-calendar.component.fixture';

import {
  DatepickerNoFormatTestComponent
} from './datepicker-noformat.component.fixture';

import {
  DatepickerReactiveTestComponent
} from './datepicker-reactive.component.fixture';

import {
  DatepickerTestComponent
} from './datepicker.component.fixture';

@NgModule({
  declarations: [
    DatepickerCalendarTestComponent,
    DatepickerNoFormatTestComponent,
    DatepickerReactiveTestComponent,
    DatepickerTestComponent
  ],
  imports: [
    SkyDatepickerModule,
    NoopAnimationsModule,
    FormsModule,
    ReactiveFormsModule
  ],
  exports: [
    DatepickerCalendarTestComponent,
    DatepickerNoFormatTestComponent,
    DatepickerReactiveTestComponent,
    DatepickerTestComponent
  ]
})
export class DatepickerTestModule { }
