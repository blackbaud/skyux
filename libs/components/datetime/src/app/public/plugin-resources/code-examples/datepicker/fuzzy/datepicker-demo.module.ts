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
  SkyDatepickerModule
} from '@skyux/datetime';

import {
  DatepickerDemoComponent
} from './datepicker-demo.component';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    SkyDatepickerModule
  ],
  exports: [
    DatepickerDemoComponent
  ],
  declarations: [
    DatepickerDemoComponent
  ]
})
export class DatepickerDemoModule { }
