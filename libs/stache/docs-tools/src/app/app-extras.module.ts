import {
  NgModule
} from '@angular/core';

import {
  SkyCodeBlockModule,
  SkyCodeModule
} from '@blackbaud/skyux-lib-code-block';

import {
  SkyPopoverModule
} from '@skyux/popovers';

import {
  SkyAppLinkModule
} from '@skyux/router';

import {
  SkyDocsToolsModule,
  SkyDocsToolsOptions
} from './public';

@NgModule({
  exports: [
    SkyAppLinkModule,
    SkyCodeBlockModule,
    SkyCodeModule,
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
