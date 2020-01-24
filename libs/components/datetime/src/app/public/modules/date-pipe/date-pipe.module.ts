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

import {
  SkyFuzzyDatePipe
} from './fuzzy-date.pipe';

@NgModule({
  declarations: [
    SkyDatePipe,
    SkyFuzzyDatePipe
  ],
  providers: [
    SkyDatePipe,
    SkyFuzzyDatePipe
  ],
  imports: [
    CommonModule,
    SkyDateTimeResourcesModule
  ],
  exports: [
    SkyDatePipe,
    SkyFuzzyDatePipe
  ]
})
export class SkyDatePipeModule { }
