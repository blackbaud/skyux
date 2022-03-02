import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { SkyRichTextDisplayComponent } from './rich-text-display.component';

@NgModule({
  imports: [CommonModule],
  exports: [SkyRichTextDisplayComponent],
  declarations: [SkyRichTextDisplayComponent],
})
export class SkyRichTextDisplayModule {}
