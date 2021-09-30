import {
  CommonModule
} from '@angular/common';

import {
  NgModule
} from '@angular/core';

import {
  ReactiveFormsModule
} from '@angular/forms';

import {
  SkyIdModule
} from '@skyux/core';

import {
  SkyDatepickerModule
} from 'projects/datetime/src/public-api';

import {
  SkyInputBoxModule
} from '@skyux/forms';

import {
  DatepickerDemoComponent
} from './datepicker-demo.component';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    SkyDatepickerModule,
    SkyIdModule,
    SkyInputBoxModule
  ],
  exports: [
    DatepickerDemoComponent
  ],
  declarations: [
    DatepickerDemoComponent
  ]
})
export class DatepickerDemoModule { }
