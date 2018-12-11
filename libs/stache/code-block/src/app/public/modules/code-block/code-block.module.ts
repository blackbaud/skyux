import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SkyCodeBlockComponent } from './code-block.component';

import { SkyClipboardModule } from '@blackbaud/skyux-lib-clipboard';
import { SkyI18nModule } from '@skyux/i18n';

@NgModule({
  declarations: [
    SkyCodeBlockComponent
  ],
  imports: [
    CommonModule,
    SkyClipboardModule,
    SkyI18nModule
  ],
  exports: [
    SkyCodeBlockComponent
  ]
})
export class SkyCodeBlockModule { }
