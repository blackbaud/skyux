import {
  NgModule
} from '@angular/core';

import {
  CommonModule
} from '@angular/common';

import {
  SkyFluidGridModule
} from 'projects/layout/src/public-api';

import {
  FluidGridDemoComponent
} from './fluid-grid-demo.component';

@NgModule({
  imports: [
    CommonModule,
    SkyFluidGridModule
  ],
  declarations: [
    FluidGridDemoComponent
  ],
  exports: [
    FluidGridDemoComponent
  ]
})
export class FormatDemoModule { }
