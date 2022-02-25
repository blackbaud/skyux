import { NgModule } from '@angular/core';

import { CommonModule } from '@angular/common';

import { SkyTextExpandRepeaterModule } from 'projects/layout/src/public-api';

import { TextExpandRepeaterDemoComponent } from './text-expand-repeater-demo.component';

@NgModule({
  imports: [CommonModule, SkyTextExpandRepeaterModule],
  declarations: [TextExpandRepeaterDemoComponent],
  exports: [TextExpandRepeaterDemoComponent],
})
export class TextExpandRepeaterDemoModule {}
