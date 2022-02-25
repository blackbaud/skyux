import { NgModule } from '@angular/core';

import { CommonModule } from '@angular/common';

import { SkyTextExpandModule } from '@skyux/layout';

import { TextExpandDemoComponent } from './text-expand-demo.component';

@NgModule({
  imports: [CommonModule, SkyTextExpandModule],
  declarations: [TextExpandDemoComponent],
  exports: [TextExpandDemoComponent],
})
export class TextExpandDemoModule {}
