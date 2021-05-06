import { NgModule } from '@angular/core';
import { SkyDocsToolsModule, SkyDocsToolsOptions } from '@skyux/docs-tools';
import { SkyAppLinkModule } from '@skyux/router';

import { SkyActionHubModule, SkyPageHeaderModule } from './public/public_api';

@NgModule({
  exports: [
    SkyActionHubModule,
    SkyPageHeaderModule,
    SkyAppLinkModule,
    SkyDocsToolsModule
  ],
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
export class AppExtrasModule {}
