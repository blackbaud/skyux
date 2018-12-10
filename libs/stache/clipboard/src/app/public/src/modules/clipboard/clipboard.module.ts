import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SkyCopyToClipboardService } from './clipboard.service';
import { SkyI18nModule } from '@skyux/i18n';
import { SkyCopyToClipboardComponent } from './clipboard.component';
import { SkyClipboardWindowRef } from '../shared';

@NgModule({
  declarations: [
    SkyCopyToClipboardComponent
  ],
  imports: [
    CommonModule,
    SkyI18nModule
  ],
  exports: [
    SkyCopyToClipboardComponent
  ],
  providers: [
    SkyCopyToClipboardService,
    SkyClipboardWindowRef
  ]
})
export class SkyClipboardModule { }
