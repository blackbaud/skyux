import {
  CommonModule
} from '@angular/common';

import {
  NgModule
} from '@angular/core';

import {
  SkyDateTimeResourcesModule
} from '../shared/datetime-resources.module';

import {
  SkyDatePipe
} from './date.pipe';

@NgModule({
  declarations: [
    SkyDatePipe
  ],
  providers: [
    SkyDatePipe
  ],
  imports: [
    CommonModule,
    SkyDateTimeResourcesModule
  ],
  exports: [
    SkyDatePipe
  ]
})
export class SkyDatePipeModule { }
