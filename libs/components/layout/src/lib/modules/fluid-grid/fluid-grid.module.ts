import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { SkyColumnComponent } from './column.component';
import { SkyFluidGridComponent } from './fluid-grid.component';
import { SkyRowComponent } from './row.component';

/**
 * @docsIncludeIds SkyFluidGridComponent, SkyRowComponent, SkyColumnComponent, SkyFluidGridGutterSizeType, SkyColumnHarness, SkyColumnHarnessFilters, SkyFluidGridHarness, SkyFluidGridHarnessFilters, SkyRowHarness, SkyRowHarnessFilters
 */
@NgModule({
  imports: [CommonModule],
  declarations: [SkyRowComponent, SkyColumnComponent, SkyFluidGridComponent],
  exports: [SkyRowComponent, SkyColumnComponent, SkyFluidGridComponent],
})
export class SkyFluidGridModule {}
