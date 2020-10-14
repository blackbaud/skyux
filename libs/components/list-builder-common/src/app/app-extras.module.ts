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
  imports: [],
  exports: [
    SkyAppLinkModule,
    SkyDocsToolsModule
  ],
  providers: [
    {
      provide: SkyDocsToolsOptions,
      useValue: {
        gitRepoUrl: 'https://github.com/blackbaud/skyux-list-builder-common',
        packageName: '@skyux/list-builder-common'
      }
    }
  ],
  entryComponents: []
})
export class AppExtrasModule { }
