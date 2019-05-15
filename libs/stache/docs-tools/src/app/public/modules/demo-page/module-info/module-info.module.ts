import {
  CommonModule
} from '@angular/common';

import {
  NgModule
} from '@angular/core';

import {
  SkyCodeModule
} from '@blackbaud/skyux-lib-code-block';

import {
  SkyClipboardModule
} from '@blackbaud/skyux-lib-clipboard';

import {
  SkyHelpInlineModule
} from '@skyux/indicators';

import {
  SkyDefinitionListModule
} from '@skyux/layout';

import {
  SkyPopoverModule
} from '@skyux/popovers';

import {
  SkyDemoPageModuleInfoComponent
} from './module-info.component';

@NgModule({
  imports: [
    CommonModule,
    SkyCodeModule,
    SkyClipboardModule,
    SkyDefinitionListModule,
    SkyHelpInlineModule,
    SkyPopoverModule
  ],
  declarations: [
    SkyDemoPageModuleInfoComponent
  ],
  exports: [
    SkyDemoPageModuleInfoComponent
  ]
})
export class SkyDemoPageModuleInfoModule { }
