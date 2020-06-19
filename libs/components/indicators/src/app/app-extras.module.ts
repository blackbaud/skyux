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
  SkyThemeModule
} from '@skyux/theme';

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
  SkyStatusIndicatorModule,
  SkyTextHighlightModule,
  SkyTokensModule,
  SkyWaitModule
} from './public/public_api';

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
    SkyStatusIndicatorModule,
    SkyTextHighlightModule,
    SkyThemeModule,
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
