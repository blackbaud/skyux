import {
  NgModule
} from '@angular/core';

import {
  SkyCodeBlockModule,
  SkyCodeModule
} from '@blackbaud/skyux-lib-code-block';

import {
  SkyDocsToolsModule,
  SkyDocsToolsOptions
} from './public/public_api';

import {
  SkyAlertModule
} from '@skyux/indicators';

import {
  SkyPopoverModule
} from '@skyux/popovers';

import {
  SkyAppLinkModule
} from '@skyux/router';

import {
  SkyDocsThumbnailModule
} from './public/public_api';

@NgModule({
  exports: [
    SkyAlertModule,
    SkyAppLinkModule,
    SkyCodeBlockModule,
    SkyCodeModule,
    SkyDocsThumbnailModule,
    SkyDocsToolsModule,
    SkyPopoverModule
  ],
  providers: [
    {
      provide: SkyDocsToolsOptions,
      useValue: {
        gitRepoUrl: 'https://github.com/blackbaud/skyux-docs-tools',
        packageName: '@skyux/docs-tools'
      }
    }
  ]
})
export class AppExtrasModule { }
