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

@NgModule({
  exports: [
    SkyAppLinkModule,
    SkyDocsToolsModule
  ],
  entryComponents: [],
  providers: [
    {
      provide: SkyDocsToolsOptions,
      useValue: {
        gitRepoUrl: 'https://github.com/blackbaud/skyux-pages',
        packageName: '@skyux/pages'
      }
    }
  ]
})
export class AppExtrasModule { }
