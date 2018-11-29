import {
  NgModule
} from '@angular/core';

import {
  SkyListModule,
  SkyListToolbarModule
} from '@skyux/list-builder';

import {
  ListStateDispatcher,
  ListState
} from '@skyux/list-builder/modules/list/state';

import {
  SkyListViewGridModule
} from './public';

@NgModule({
  imports: [
    SkyListModule,
    SkyListViewGridModule
  ],
  exports: [
    SkyListModule,
    SkyListViewGridModule,
    SkyListToolbarModule
  ],
  providers: [
    ListState,
    ListStateDispatcher
  ]
})
export class AppExtrasModule { }
