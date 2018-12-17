import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StacheCopyToClipboardService } from './clipboard.service';
import { StacheCopyToClipboardComponent } from './clipboard.component';
import { SkyClipboardModule } from '@blackbaud/skyux-lib-clipboard';

@NgModule({
  declarations: [
    StacheCopyToClipboardComponent
  ],
  imports: [
    CommonModule,
    SkyClipboardModule
  ],
  exports: [
    StacheCopyToClipboardComponent
  ],
  providers: [
    StacheCopyToClipboardService
  ]
})
export class StacheClipboardModule { }
