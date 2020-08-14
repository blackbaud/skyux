import {
  NgModule
} from '@angular/core';

import {
  SkyDocsToolsModule,
  SkyDocsToolsOptions
} from '@skyux/docs-tools';

import {
  SkyListModule,
  SkyListToolbarModule
} from '@skyux/list-builder';

import {
  SkyAppLinkModule
} from '@skyux/router';

import {
  SkyListViewGridModule
} from './public/public_api';

@NgModule({
  exports: [
    SkyAppLinkModule,
    SkyDocsToolsModule,
    SkyListModule,
    SkyListViewGridModule,
    SkyListToolbarModule
  ],
  providers: [
    {
      provide: SkyDocsToolsOptions,
      useValue: {
        gitRepoUrl: 'https://github.com/blackbaud/skyux-list-builder-view-grids',
        packageName: '@skyux/list-builder-view-grids'
      }
    }
  ]
})
export class AppExtrasModule { }
