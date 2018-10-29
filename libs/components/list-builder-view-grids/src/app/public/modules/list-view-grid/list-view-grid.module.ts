import {
  NgModule
} from '@angular/core';
import {
  CommonModule
} from '@angular/common';

import {
  SkyWaitModule
} from '@skyux/indicators/modules/wait/wait.module';

import {
  SkyGridModule
} from '@skyux/grids/modules/grid/grid.module';

import {
  SkyListViewGridComponent
} from './list-view-grid.component';
import {
  SkyListViewGridResourcesModule
} from '../shared/list-view-grid-resources.module';

@NgModule({
  declarations: [
    SkyListViewGridComponent
  ],
  imports: [
    CommonModule,
    SkyWaitModule,
    SkyGridModule,
    SkyListViewGridResourcesModule
  ],
  exports: [
    SkyListViewGridComponent
  ]
})
export class SkyListViewGridModule {
}
