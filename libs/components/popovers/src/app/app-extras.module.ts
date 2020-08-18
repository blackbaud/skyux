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
  SkyAuthHttpClientModule
} from '@skyux/http';

import {
  SkyAppLinkModule
} from '@skyux/router';

import {
  SkyDropdownModule,
  SkyPopoverModule
} from './public/public_api';

@NgModule({
  exports: [
    SkyAppLinkModule,
    SkyAuthHttpClientModule,
    SkyCodeModule,
    SkyDocsToolsModule,
    SkyDropdownModule,
    SkyPopoverModule
  ],
  providers: [
    {
      provide: SkyDocsToolsOptions,
      useValue: {
        gitRepoUrl: 'https://github.com/blackbaud/skyux-popovers',
        packageName: '@skyux/popovers'
      }
    }
  ]
})
export class AppExtrasModule { }
