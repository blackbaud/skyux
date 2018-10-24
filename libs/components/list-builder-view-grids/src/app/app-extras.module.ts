import {
  NgModule
} from '@angular/core';
import {
  SkyListViewGridModule
} from './public/modules/list-view-grid/list-view-grid.module';

import {
  SkyGridModule
} from '@skyux/grids';
import {
  SkyListModule
} from '@skyux/list-builder';

import {
  ListStateDispatcher,
  ListState
} from '@skyux/list-builder/modules/list/state';

@NgModule({
  imports: [
    SkyGridModule,
    SkyListModule,
    SkyListViewGridModule
  ],
  exports: [
    SkyGridModule,
    SkyListModule,
    SkyListViewGridModule
  ],
  providers: [
    ListState,
    ListStateDispatcher
  ]
})
export class AppExtrasModule { }
