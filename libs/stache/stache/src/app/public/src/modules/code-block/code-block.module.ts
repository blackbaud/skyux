import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StacheCodeBlockComponent } from './code-block.component';
import { StacheClipboardModule } from '../clipboard';
import { SkyAppRuntimeModule } from '@blackbaud/skyux-builder/runtime';

@NgModule({
  declarations: [
    StacheCodeBlockComponent
  ],
  imports: [
    CommonModule,
    StacheClipboardModule,
    SkyAppRuntimeModule
  ],
  exports: [
    StacheCodeBlockComponent
  ]
})
export class StacheCodeBlockModule { }
