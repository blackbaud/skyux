import {
  NgModule
} from '@angular/core';

import {
  SkyCodeBlockModule,
  SkyCodeModule
} from '@blackbaud/skyux-lib-code-block';

// Do not import from public_api since the SKY UX plugin needs to assign providers from the same place.
// (The SKY UX plugin pulls types from node_modules.)
import {
  SkyDocsToolsModule,
  SkyDocsToolsOptions
} from '@skyux/docs-tools'; // <-- Important!

import {
  SkyAlertModule
} from '@skyux/indicators';

import {
  SkyPopoverModule
} from '@skyux/popovers';

import {
  SkyAppLinkModule
} from '@skyux/router';

@NgModule({
  exports: [
    SkyAlertModule,
    SkyAppLinkModule,
    SkyCodeBlockModule,
    SkyCodeModule,
    SkyDocsToolsModule,
    SkyPopoverModule
  ],
  providers: [
    {
      provide: SkyDocsToolsOptions,
      useValue: {
        gitRepoUrl: 'https://github.com/blackbaud/skyux-docs-tools',
        packageName: '@skyux/docs-tools'
      }
    }
  ]
})
export class AppExtrasModule { }
