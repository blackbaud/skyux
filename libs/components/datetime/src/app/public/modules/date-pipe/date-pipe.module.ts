import {
  CommonModule,
  DatePipe
} from '@angular/common';

import {
  NgModule
} from '@angular/core';

import {
  SkyDatePipe
} from './date.pipe';

@NgModule({
  declarations: [
    SkyDatePipe
  ],
  providers: [
    DatePipe
  ],
  imports: [
    CommonModule
  ],
  exports: [
    SkyDatePipe
  ]
})
export class SkyDatePipeModule { }
