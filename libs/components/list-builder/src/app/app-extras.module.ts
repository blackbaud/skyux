import {
  NgModule
} from '@angular/core';

import {
  SkyIconModule
} from '@skyux/indicators';

import {
  SkyRadioModule
} from '@skyux/forms';

import {
  SkyAppLinkModule
} from '@skyux/router';

import {
  SkyListFiltersModule,
  SkyListModule,
  SkyListPagingModule,
  SkyListSecondaryActionsModule,
  SkyListToolbarModule
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
    SkyRadioModule
  ],
  providers: [],
  entryComponents: []
})
export class AppExtrasModule { }
