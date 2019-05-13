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
  SkyCodeBlockComponent
} from './code-block.component';

import {
  SkyCodeBlockResourcesModule
} from '../shared';

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
