import {
  NgModule
} from '@angular/core';

import {
  SkyDocsToolsModule,
  SkyDocsToolsOptions
} from '@skyux/docs-tools';

import {
  SkyErrorModule
} from '@skyux/errors';

import {
  SkyAppLinkModule
} from '@skyux/router';

import {
  SkyAvatarModule
} from './public/public_api';

@NgModule({
  exports: [
    SkyAppLinkModule,
    SkyAvatarModule,
    SkyDocsToolsModule,
    SkyErrorModule
  ],
  providers: [
    {
      provide: SkyDocsToolsOptions,
      useValue: {
        gitRepoUrl: 'https://github.com/blackbaud/skyux-avatar',
        packageName: '@skyux/avatar'
      }
    }
  ]
})
export class AppExtrasModule { }
