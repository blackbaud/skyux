import {
  NgModule
} from '@angular/core';

import {
  SkyCodeModule
} from '@blackbaud/skyux-lib-code-block';

import {
  SkyDocsToolsModule
} from '@skyux/docs-tools';

import {
  SkyAppLinkModule
} from '@skyux/router';

import {
  SkyDropdownModule,
  SkyPopoverModule
} from './public';

@NgModule({
  exports: [
    SkyAppLinkModule,
    SkyCodeModule,
    SkyDropdownModule,
    SkyPopoverModule,
    SkyDocsToolsModule
  ]
})
export class AppExtrasModule { }
