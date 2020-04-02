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
  SkyCodeModule
} from '@blackbaud/skyux-lib-code-block';

import {
  SkyAlertModule,
  SkyChevronModule,
  SkyHelpInlineModule,
  SkyIconModule,
  SkyKeyInfoModule,
  SkyLabelModule,
  SkyTextHighlightModule,
  SkyTokensModule,
  SkyWaitModule
} from './public';

@NgModule({
  exports: [
    SkyAlertModule,
    SkyAppLinkModule,
    SkyChevronModule,
    SkyCodeModule,
    SkyDocsToolsModule,
    SkyHelpInlineModule,
    SkyIconModule,
    SkyKeyInfoModule,
    SkyLabelModule,
    SkyTextHighlightModule,
    SkyTokensModule,
    SkyWaitModule
  ],
  providers: [
    {
      provide: SkyDocsToolsOptions,
      useValue: {
        gitRepoUrl: 'https://github.com/blackbaud/skyux-indicators',
        packageName: '@skyux/indicators'
      }
    }
  ]
})
export class AppExtrasModule { }
