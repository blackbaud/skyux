import { NgModule } from '@angular/core';
import { SkyDocsToolsModule, SkyDocsToolsOptions } from '@skyux/docs-tools';
import { SkyIconModule } from '@skyux/indicators';
import { SkyConfirmModule } from '@skyux/modals';
import { SkyDropdownModule } from '@skyux/popovers';
import { SkyAppLinkModule } from '@skyux/router';

import { SkyActionHubModule, SkyPageHeaderModule } from './public/public_api';

@NgModule({
  exports: [
    SkyActionHubModule,
    SkyAppLinkModule,
    SkyConfirmModule,
    SkyDocsToolsModule,
    SkyDropdownModule,
    SkyIconModule,
    SkyPageHeaderModule
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
