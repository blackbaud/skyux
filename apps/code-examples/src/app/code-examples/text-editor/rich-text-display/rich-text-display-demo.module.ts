import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SkyRichTextDisplayModule } from '@skyux/text-editor';

import { RichTextDisplayDemoComponent } from './rich-text-display-demo.component';

@NgModule({
  imports: [CommonModule, SkyRichTextDisplayModule],
  declarations: [RichTextDisplayDemoComponent],
  exports: [RichTextDisplayDemoComponent],
})
export class RichTextDisplayDemoModule {}
