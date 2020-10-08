import {
  NgModule
} from '@angular/core';

import {
  SkyCodeModule
} from '@blackbaud/skyux-lib-code-block';

import {
  SkyIdModule
} from '@skyux/core';

import {
  SkyDocsToolsModule,
  SkyDocsToolsOptions
} from '@skyux/docs-tools';

import {
  SkyModalModule
} from '@skyux/modals';

import {
  SkyAppLinkModule
} from '@skyux/router';

import {
  SkySelectFieldModule
} from './public/public_api';

@NgModule({
  exports: [
    SkyAppLinkModule,
    SkyCodeModule,
    SkyDocsToolsModule,
    SkyIdModule,
    SkyModalModule,
    SkySelectFieldModule
  ],
  providers: [
    {
      provide: SkyDocsToolsOptions,
      useValue: {
        gitRepoUrl: 'https://github.com/blackbaud/skyux-select-field',
        packageName: '@skyux/select-field'
      }
    }
  ]
})
export class AppExtrasModule { }
