import {
  NgModule
} from '@angular/core';

import {
  SkyIdModule
} from '@skyux/core';

import {
  SkyDocsToolsModule,
  SkyDocsToolsOptions
} from '@skyux/docs-tools';

import {
  SkyCheckboxModule,
  SkyRadioModule
} from '@skyux/forms';

import {
  SkyAlertModule,
  SkyIconModule
} from '@skyux/indicators';

import {
  SkyFilterModule
} from '@skyux/lists';

import {
  SkyModalModule
} from '@skyux/modals';

import {
  SkyDropdownModule
} from '@skyux/popovers';

import {
  SkyAppLinkModule
} from '@skyux/router';

import {
  SkyListViewGridModule
} from '@skyux/list-builder-view-grids';

import {
  ListFiltersDocsModalComponent
} from './docs/list-filters/demo/list-filters-docs-modal.component';

import {
  SkyListFiltersModule,
  SkyListModule,
  SkyListPagingModule,
  SkyListSecondaryActionsModule,
  SkyListToolbarModule
} from './public/public_api';

@NgModule({
  exports: [
    SkyAlertModule,
    SkyAppLinkModule,
    SkyCheckboxModule,
    SkyDocsToolsModule,
    SkyDropdownModule,
    SkyFilterModule,
    SkyIconModule,
    SkyIdModule,
    SkyModalModule,
    SkyListModule,
    SkyListFiltersModule,
    SkyListPagingModule,
    SkyListSecondaryActionsModule,
    SkyListToolbarModule,
    SkyListViewGridModule,
    SkyRadioModule
  ],
  providers: [
    {
      provide: SkyDocsToolsOptions,
      useValue: {
        gitRepoUrl: 'https://github.com/blackbaud/skyux-list-builder',
        packageName: '@skyux/list-builder'
      }
    }
  ],
  entryComponents: [
    ListFiltersDocsModalComponent
  ]
})
export class AppExtrasModule { }
