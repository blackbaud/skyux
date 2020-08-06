import {
  NgModule
} from '@angular/core';

import {
  SkyCodeModule
} from '@blackbaud/skyux-lib-code-block';

import {
  SkyDocsToolsModule,
  SkyDocsToolsOptions
} from '@skyux/docs-tools';

import {
  SkyIconModule
} from '@skyux/indicators';

import {
  SkyFluidGridModule
} from '@skyux/layout';

import {
  SkyAppLinkModule
} from '@skyux/router';

import {
  SkyAutofillModule,
  SkyCheckboxModule,
  SkyFileAttachmentsModule,
  SkyInputBoxModule,
  SkyRadioModule,
  SkyCharacterCounterModule,
  SkyToggleSwitchModule
} from './public/public_api';

@NgModule({
  exports: [
    SkyAppLinkModule,
    SkyAutofillModule,
    SkyCodeModule,
    SkyCheckboxModule,
    SkyDocsToolsModule,
    SkyFileAttachmentsModule,
    SkyFluidGridModule,
    SkyIconModule,
    SkyInputBoxModule,
    SkyRadioModule,
    SkyCharacterCounterModule,
    SkyToggleSwitchModule
  ],
  providers: [
    {
      provide: SkyDocsToolsOptions,
      useValue: {
        gitRepoUrl: 'https://github.com/blackbaud/skyux-forms',
        packageName: '@skyux/forms'
      }
    }
  ]
})
export class AppExtrasModule { }
