import {
  NgModule
} from '@angular/core';

import {
  SkyAppLinkModule
} from '@skyux/router';

import {
  SkyListModule,
  SkyListToolbarModule
} from '@skyux/list-builder';

import {
  SkyListViewChecklistModule
} from './public/public_api';

@NgModule({
  exports: [
    SkyAppLinkModule,
    SkyListModule,
    SkyListViewChecklistModule,
    SkyListToolbarModule
  ]
})
export class AppExtrasModule { }
