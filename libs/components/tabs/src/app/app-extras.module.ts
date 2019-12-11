import {
  NgModule
} from '@angular/core';

import {
  SkyDocsToolsModule,
  SkyDocsToolsOptions
} from '@skyux/docs-tools';

import {
  SkyCheckboxModule
} from '@skyux/forms';

import {
  SkyAppLinkModule
} from '@skyux/router';

import {
  SkyTabsModule,
  SkySectionedFormModule,
  SkyVerticalTabsetModule
} from './public';

@NgModule({
  exports: [
    SkyAppLinkModule,
    SkyCheckboxModule,
    SkyDocsToolsModule,
    SkySectionedFormModule,
    SkyTabsModule,
    SkyVerticalTabsetModule
  ],
  providers: [
    {
      provide: SkyDocsToolsOptions,
      useValue: {
        gitRepoUrl: 'https://github.com/blackbaud/skyux-tabs',
        packageName: '@skyux/tabs'
      }
    }
  ]
})
export class AppExtrasModule { }
