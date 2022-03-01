import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SkyFluidGridModule } from '@skyux/layout';

import { FluidGridDemoComponent } from './fluid-grid-demo.component';

@NgModule({
  imports: [CommonModule, SkyFluidGridModule],
  declarations: [FluidGridDemoComponent],
  exports: [FluidGridDemoComponent],
})
export class FormatDemoModule {}
