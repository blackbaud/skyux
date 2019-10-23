import {
  NgModule
} from '@angular/core';

import {
  SkyIconModule
} from '@skyux/indicators';

import {
  SkyAppLinkModule
} from '@skyux/router';

import {
  SkyListFiltersModule,
  SkyListModule,
  SkyListPagingModule,
  SkyListSecondaryActionsModule,
  SkyListToolbarModule,
  SkyListViewSwitcherModule
} from './public';

@NgModule({
  exports: [
    SkyAppLinkModule,
    SkyIconModule,
    SkyListModule,
    SkyListFiltersModule,
    SkyListPagingModule,
    SkyListSecondaryActionsModule,
    SkyListToolbarModule,
    SkyListViewSwitcherModule
  ],
  providers: [],
  entryComponents: []
})
export class AppExtrasModule { }
