import { NgModule } from '@angular/core';

import { SkyDataGridColumnComponent } from './data-grid-column.component';
import { SkyDataGridLiteComponent } from './data-grid-lite.component';
import { SkyDataGridComponent } from './data-grid.component';

/**
 * @preview
 */
@NgModule({
  exports: [
    SkyDataGridComponent,
    SkyDataGridColumnComponent,
    SkyDataGridLiteComponent,
  ],
  imports: [
    SkyDataGridComponent,
    SkyDataGridColumnComponent,
    SkyDataGridLiteComponent,
  ],
})
export class SkyDataGridModule {}
