import {
  NgModule
} from '@angular/core';

import {
  SkyListModule,
  SkyListToolbarModule
} from '@skyux/list-builder';

import {
  SkyListViewGridModule
} from './public';

@NgModule({
  exports: [
    SkyListModule,
    SkyListViewGridModule,
    SkyListToolbarModule
  ]
})
export class AppExtrasModule { }
