import {
  CommonModule
} from '@angular/common';

import {
  NgModule
} from '@angular/core';

import {
  SkyCoreResourcesModule
} from '../shared/core-resources.module';

import {
  SkyPercentPipe
} from './percent.pipe';

@NgModule({
  declarations: [
    SkyPercentPipe
  ],
  providers: [
    SkyPercentPipe
  ],
  imports: [
    CommonModule,
    SkyCoreResourcesModule
  ],
  exports: [
    SkyPercentPipe
  ]
})
export class SkyPercentPipeModule { }
