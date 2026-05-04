import { NgModule } from '@angular/core';

import { SkyDataGridColumnComponent } from './data-grid-column.component';
import { SkyDataGridComponent } from './data-grid.component';

/**
 * @preview
 */
@NgModule({
  exports: [SkyDataGridComponent, SkyDataGridColumnComponent],
  imports: [SkyDataGridComponent, SkyDataGridColumnComponent],
})
export class SkyDataGridModule {}
