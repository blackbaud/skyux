import {
  CommonModule
} from '@angular/common';

import {
  NgModule
} from '@angular/core';

import {
  SkyPercentPipeModule
} from '../percent-pipe.module';

import {
  PercentPipeTestComponent
} from './percent-pipe.component.fixture';

@NgModule({
  declarations: [
    PercentPipeTestComponent
  ],
  exports: [
    PercentPipeTestComponent
  ],
  imports: [
    CommonModule,
    SkyPercentPipeModule
  ]
})
export class PercentPipeTestModule { }
