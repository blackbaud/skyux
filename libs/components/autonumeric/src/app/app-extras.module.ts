import {
  NgModule
} from '@angular/core';

import {
  SkyAppLinkModule
} from '@skyux/router';

import {
  SkyAutonumericModule
} from './public/public_api';

import {
  SkyDocsToolsModule,
  SkyDocsToolsOptions
} from '@skyux/docs-tools';

@NgModule({
  exports: [
    SkyAppLinkModule,
    SkyAutonumericModule,
    SkyDocsToolsModule
  ],
  providers: [
    {
      provide: SkyDocsToolsOptions,
      useValue: {
        gitRepoUrl: 'https://github.com/blackbaud/skyux-autonumeric',
        packageName: '@skyux/autonumeric'
      }
    }
  ]
})
export class AppExtrasModule { }
