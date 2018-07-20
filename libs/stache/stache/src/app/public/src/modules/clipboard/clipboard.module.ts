import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StacheCopyToClipboardService } from './clipboard.service';
import { FormsModule } from '@angular/forms';
import { SkyAppRuntimeModule } from '@blackbaud/skyux-builder/runtime';
import { StacheCopyToClipboardComponent } from './clipboard.component';

@NgModule({
  declarations: [
    StacheCopyToClipboardComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    SkyAppRuntimeModule
  ],
  exports: [
    StacheCopyToClipboardComponent
  ],
  providers: [
    StacheCopyToClipboardService
  ]
})
export class StacheClipboardModule { }
