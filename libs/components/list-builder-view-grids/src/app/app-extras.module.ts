import {
  NgModule
} from '@angular/core';

import {
  SkyListModule,
  SkyListToolbarModule
} from '@skyux/list-builder';

import {
  SkyAppLinkModule
} from '@skyux/router';

import {
  SkyListViewGridModule
} from './public';

@NgModule({
  exports: [
    SkyAppLinkModule,
    SkyListModule,
    SkyListViewGridModule,
    SkyListToolbarModule
  ]
})
export class AppExtrasModule { }
