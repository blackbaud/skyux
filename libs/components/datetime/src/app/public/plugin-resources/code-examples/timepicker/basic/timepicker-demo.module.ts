import {
  CommonModule
} from '@angular/common';

import {
  NgModule
} from '@angular/core';

import {
  FormsModule,
  ReactiveFormsModule
} from '@angular/forms';

import {
  SkyTimepickerModule
} from '@skyux/datetime';

import {
  TimepickerDemoComponent
} from './timepicker-demo.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SkyTimepickerModule
  ],
  exports: [
    TimepickerDemoComponent
  ],
  declarations: [
    TimepickerDemoComponent
  ]
})
export class TimepickerDemoModule { }
