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
  imports: [
    SkyListModule,
    SkyListToolbarModule,
    SkyListViewChecklistModule
  ],
  exports: [
    SkyListModule,
    SkyListToolbarModule,
    SkyListViewChecklistModule
  ],
  providers: [],
  entryComponents: []
})
export class AppExtrasModule { }
