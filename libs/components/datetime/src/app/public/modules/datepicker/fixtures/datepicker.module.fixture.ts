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
  SkyInputBoxModule
} from '@skyux/forms';

import {
  SkyDatepickerModule
} from '../datepicker.module';

import {
  DatepickerCalendarTestComponent
} from './datepicker-calendar.component.fixture';

import {
  DatepickerInputBoxTestComponent
} from './datepicker-input-box.component.fixture';

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
    DatepickerInputBoxTestComponent,
    DatepickerNoFormatTestComponent,
    DatepickerReactiveTestComponent,
    DatepickerTestComponent
  ],
  imports: [
    SkyDatepickerModule,
    NoopAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    SkyInputBoxModule
  ],
  exports: [
    DatepickerCalendarTestComponent,
    DatepickerInputBoxTestComponent,
    DatepickerNoFormatTestComponent,
    DatepickerReactiveTestComponent,
    DatepickerTestComponent
  ]
})
export class DatepickerTestModule { }
