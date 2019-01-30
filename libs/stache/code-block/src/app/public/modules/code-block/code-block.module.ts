import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SkyCodeBlockComponent } from './code-block.component';

import { SkyClipboardModule } from '@blackbaud/skyux-lib-clipboard';
import { SkyI18nModule } from '@skyux/i18n';
import { SkyCodeBlockResourcesModule } from '../shared';

@NgModule({
  declarations: [
    SkyCodeBlockComponent
  ],
  imports: [
    CommonModule,
    SkyClipboardModule,
    SkyI18nModule,
    SkyCodeBlockResourcesModule
  ],
  exports: [
    SkyCodeBlockComponent
  ]
})
export class SkyCodeBlockModule { }
