import {
  NgModule
} from '@angular/core';

import {
  SkyDocsToolsModule,
  SkyDocsToolsOptions
} from '@skyux/docs-tools';

import {
  SkyStatusIndicatorModule
} from '@skyux/indicators';

import {
  SkyAppLinkModule
} from '@skyux/router';

import {
  SkyPhoneFieldModule
} from './public/public_api';

@NgModule({
  exports: [
    SkyAppLinkModule,
    SkyDocsToolsModule,
    SkyPhoneFieldModule,
    SkyStatusIndicatorModule
  ],
  providers: [
    {
      provide: SkyDocsToolsOptions,
      useValue: {
        gitRepoUrl: 'https://github.com/blackbaud/skyux-forms',
        packageName: '@skyux/phone-field'
      }
    }
  ]
})
export class AppExtrasModule { }
