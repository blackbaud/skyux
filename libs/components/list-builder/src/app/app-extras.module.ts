import {
  NgModule
} from '@angular/core';

import {
  SkyDocsToolsModule,
  SkyDocsToolsOptions
} from '@skyux/docs-tools';

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
    SkyDocsToolsModule,
    SkyIconModule,
    SkyListModule,
    SkyListFiltersModule,
    SkyListPagingModule,
    SkyListSecondaryActionsModule,
    SkyListToolbarModule,
    SkyListViewSwitcherModule
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
  entryComponents: []
})
export class AppExtrasModule { }
