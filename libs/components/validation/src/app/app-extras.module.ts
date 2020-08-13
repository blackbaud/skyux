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
  SkyEmailValidationModule,
  SkyUrlValidationModule
} from './public/public_api';

@NgModule({
  exports: [
    SkyAppLinkModule,
    SkyDocsToolsModule,
    SkyEmailValidationModule,
    SkyUrlValidationModule
  ],
  providers: [
    {
      provide: SkyDocsToolsOptions,
      useValue: {
        gitRepoUrl: 'https://github.com/blackbaud/skyux-validation',
        packageName: '@skyux/validation'
      }
    }
  ]
})
export class AppExtrasModule { }
