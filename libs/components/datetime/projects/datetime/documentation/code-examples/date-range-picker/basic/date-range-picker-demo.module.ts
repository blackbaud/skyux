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
  SkyDateRangePickerModule
} from 'projects/datetime/src/public-api';

import {
  DateRangePickerDemoComponent
} from './date-range-picker-demo.component';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    SkyDateRangePickerModule
  ],
  exports: [
    DateRangePickerDemoComponent
  ],
  declarations: [
    DateRangePickerDemoComponent
  ]
})
export class DateRangePickerDemoModule { }
