import { NgModule } from '@angular/core';

import { SkyColumnComponent } from './column.component';
import { SkyFluidGridComponent } from './fluid-grid.component';
import { SkyRowComponent } from './row.component';

@NgModule({
  imports: [SkyColumnComponent, SkyFluidGridComponent, SkyRowComponent],
  exports: [SkyColumnComponent, SkyFluidGridComponent, SkyRowComponent],
})
export class SkyFluidGridModule {}
