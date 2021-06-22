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
  SkyInputBoxModule
} from '@skyux/forms';

import {
  SkyAlertModule,
  SkyIconModule
} from '@skyux/indicators';

import {
  SkyPageModule
} from '@skyux/layout';

import {
  SkyAppLinkModule
} from '@skyux/router';

import {
  SkyRichTextDisplayModule,
  SkyTextEditorModule
} from './public/public_api';

@NgModule({
  exports: [
    SkyAlertModule,
    SkyAppLinkModule,
    SkyDocsToolsModule,
    SkyPageModule,
    SkyAppLinkModule,
    SkyTextEditorModule,
    SkyRichTextDisplayModule,
    SkyIconModule,
    SkyIdModule,
    SkyInputBoxModule
  ],
  providers: [
    {
      provide: SkyDocsToolsOptions,
      useValue: {
        gitRepoUrl: 'https://github.com/blackbaud/skyux-text-editor',
        packageName: '@skyux/text-editor'
      }
    }
  ]
})
export class AppExtrasModule { }
