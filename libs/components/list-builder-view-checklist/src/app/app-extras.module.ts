import {
  NgModule
} from '@angular/core';

import {
  SkyListModule,
  SkyListToolbarModule
} from '@skyux/list-builder';

import {
  SkyListViewChecklistModule
} from './public';

@NgModule({
  exports: [
    SkyListModule,
    SkyListViewChecklistModule,
    SkyListToolbarModule
  ]
})
export class AppExtrasModule { }
