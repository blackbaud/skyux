import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SkyFormatModule } from '@skyux/layout';

import { FormatDemoComponent } from './format-demo.component';

@NgModule({
  imports: [CommonModule, SkyFormatModule],
  declarations: [FormatDemoComponent],
  exports: [FormatDemoComponent],
})
export class FormatDemoModule {}
