import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SkyRowComponent } from './row.component';
import { SkyColumnComponent } from './column.component';
import { SkyFluidGridComponent } from './fluid-grid.component';

@NgModule({
  imports: [CommonModule],
  declarations: [SkyRowComponent, SkyColumnComponent, SkyFluidGridComponent],
  exports: [SkyRowComponent, SkyColumnComponent, SkyFluidGridComponent],
})
export class SkyFluidGridModule {}
