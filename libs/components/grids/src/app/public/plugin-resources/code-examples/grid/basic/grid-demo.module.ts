import {
  NgModule
} from '@angular/core';

import {
  CommonModule
} from '@angular/common';

import {
  SkyGridModule
} from '@skyux/grids';

import {
  GridDemoComponent
} from './grid-demo.component';

@NgModule({
  imports: [
    CommonModule,
    SkyGridModule
  ],
  declarations: [
    GridDemoComponent
  ],
  exports: [
    GridDemoComponent
  ]
})
export class GridDemoModule { }
