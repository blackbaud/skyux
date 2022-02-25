import { CommonModule } from '@angular/common';

import { NgModule } from '@angular/core';

import { FluidGridTestComponent } from './fluid-grid.component.fixture';

import { SkyFluidGridModule } from '../fluid-grid.module';

@NgModule({
  declarations: [FluidGridTestComponent],
  exports: [FluidGridTestComponent],
  imports: [CommonModule, SkyFluidGridModule],
})
export class FluidGridTestModule {}
