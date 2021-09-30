import {
  CommonModule
} from '@angular/common';

import {
  NgModule
} from '@angular/core';

import {
  SkyFuzzyDateService
} from '../../datepicker/fuzzy-date.service';

import {
  SkyDatePipeModule
} from '../date-pipe.module';

import {
  FuzzyDatePipeTestComponent
} from './fuzzy-date-pipe.component.fixture';

@NgModule({
  declarations: [
    FuzzyDatePipeTestComponent
  ],
  exports: [
    FuzzyDatePipeTestComponent
  ],
  providers: [
    SkyFuzzyDateService
  ],
  imports: [
    CommonModule,
    SkyDatePipeModule
  ]
})
export class FuzzyDatePipeTestModule { }
