import {
  NgModule
} from '@angular/core';

import {
  SkyDocsToolsModule,
  SkyDocsToolsOptions
} from '@skyux/docs-tools';

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
    SkyDocsToolsModule,
    SkyListModule,
    SkyListViewChecklistModule,
    SkyListToolbarModule
  ],
  providers: [
    {
      provide: SkyDocsToolsOptions,
      useValue: {
        gitRepoUrl: 'https://github.com/blackbaud/skyux-list-builder-view-checklist',
        packageName: '@skyux/list-builder-view-checklist'
      }
    }
  ]
})
export class AppExtrasModule { }
