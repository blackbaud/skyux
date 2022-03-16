import {
  NgModule
} from '@angular/core';

import {
  CommonModule
} from '@angular/common';

import {
  SkyClipboardModule
} from '@blackbaud/skyux-lib-clipboard';

import {
  SkyCodeBlockResourcesModule
} from '../shared/sky-code-block-resources.module';

import {
  SkyCodeBlockComponent
} from './code-block.component';

@NgModule({
  declarations: [
    SkyCodeBlockComponent
  ],
  imports: [
    CommonModule,
    SkyClipboardModule,
    SkyCodeBlockResourcesModule
  ],
  exports: [
    SkyCodeBlockComponent
  ]
})
export class SkyCodeBlockModule { }
