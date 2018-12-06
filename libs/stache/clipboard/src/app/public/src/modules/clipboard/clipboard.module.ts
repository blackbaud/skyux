import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SkyCopyToClipboardService } from './clipboard.service';
import { SkyAppRuntimeModule } from '@blackbaud/skyux-builder/runtime';
import { SkyCopyToClipboardComponent } from './clipboard.component';
import { SkyClipboardWindowRef } from '../shared';

@NgModule({
  declarations: [
    SkyCopyToClipboardComponent
  ],
  imports: [
    CommonModule,
    SkyAppRuntimeModule
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
