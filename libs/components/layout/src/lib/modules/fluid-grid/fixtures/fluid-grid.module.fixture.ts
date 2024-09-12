import { NgModule } from '@angular/core';

import { SkyFluidGridModule } from '../fluid-grid.module';

import { FluidGridTestComponent } from './fluid-grid.component.fixture';

@NgModule({
  declarations: [FluidGridTestComponent],
  exports: [FluidGridTestComponent],
  imports: [SkyFluidGridModule],
})
export class FluidGridTestModule {}
