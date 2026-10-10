import { NgModule } from '@angular/core';

import { SkyFluidGridModule } from '../fluid-grid.module';

import { FluidGridNestedTestComponent } from './fluid-grid-nested.component.fixture';
import { FluidGridTestComponent } from './fluid-grid.component.fixture';

@NgModule({
  declarations: [FluidGridTestComponent, FluidGridNestedTestComponent],
  exports: [FluidGridTestComponent, FluidGridNestedTestComponent],
  imports: [SkyFluidGridModule],
})
export class FluidGridTestModule {}
