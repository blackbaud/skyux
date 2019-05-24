import {
  CommonModule
} from '@angular/common';

import {
  NgModule
} from '@angular/core';

import {
  SkyClipboardModule
} from '@blackbaud/skyux-lib-clipboard';

import {
  SkyCodeModule
} from '@blackbaud/skyux-lib-code-block';

import {
  SkyDefinitionListModule
} from '@skyux/layout';

import {
  SkyDocsModuleInfoComponent
} from './module-info.component';

@NgModule({
  imports: [
    CommonModule,
    SkyCodeModule,
    SkyClipboardModule,
    SkyDefinitionListModule
  ],
  declarations: [
    SkyDocsModuleInfoComponent
  ],
  exports: [
    SkyDocsModuleInfoComponent
  ]
})
export class SkyDocsModuleInfoModule { }
