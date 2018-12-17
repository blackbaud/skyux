/**
 * @deprecated since version 2.15.0. update and use the skyux-lib-codeblock unless major bugs are discovered before full deprecation in v3
 */

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StacheCodeBlockComponent } from './code-block.component';
import { SkyClipboardModule } from '@blackbaud/skyux-lib-clipboard';
import { SkyAppRuntimeModule } from '@blackbaud/skyux-builder/runtime';

@NgModule({
  declarations: [
    StacheCodeBlockComponent
  ],
  imports: [
    CommonModule,
    SkyClipboardModule,
    SkyAppRuntimeModule
  ],
  exports: [
    StacheCodeBlockComponent
  ]
})
export class StacheCodeBlockModule { }
