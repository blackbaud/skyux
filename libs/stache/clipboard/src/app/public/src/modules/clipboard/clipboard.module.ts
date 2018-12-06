import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SkyCopyToClipboardService } from './clipboard.service';
import { FormsModule } from '@angular/forms';
import { SkyAppRuntimeModule } from '@blackbaud/skyux-builder/runtime';
import { SkyCopyToClipboardComponent } from './clipboard.component';
import { SkyClipboardWindowRef } from '../shared';
import * as Clipboard from 'clipboard-polyfill/build/clipboard-polyfill.promise';

@NgModule({
  declarations: [
    SkyCopyToClipboardComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    SkyAppRuntimeModule
  ],
  exports: [
    SkyCopyToClipboardComponent
  ],
  providers: [
    SkyCopyToClipboardService,
    SkyClipboardWindowRef,
    Clipboard.DT
  ]
})
export class SkyClipboardModule { }
