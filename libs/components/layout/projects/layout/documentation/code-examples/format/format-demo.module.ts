import {
  NgModule
} from '@angular/core';

import {
  CommonModule
} from '@angular/common';

import {
  SkyFormatModule
} from 'projects/layout/src/public-api';

import {
  FormatDemoComponent
} from './format-demo.component';

@NgModule({
  imports: [
    CommonModule,
    SkyFormatModule
  ],
  declarations: [
    FormatDemoComponent
  ],
  exports: [
    FormatDemoComponent
  ]
})
export class FormatDemoModule { }
