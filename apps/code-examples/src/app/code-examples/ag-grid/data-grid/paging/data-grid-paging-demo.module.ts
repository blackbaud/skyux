import { NgModule } from '@angular/core';
import { SkyAgGridModule } from '@skyux/ag-grid';
import { SkyPagingModule } from '@skyux/lists';

import { AgGridModule } from 'ag-grid-angular';

import { DataGridPagingDemoComponent } from './data-grid-paging-demo.component';

@NgModule({
  declarations: [DataGridPagingDemoComponent],
  exports: [DataGridPagingDemoComponent],
  imports: [AgGridModule, SkyAgGridModule, SkyPagingModule],
})
export class DataGridPagingDemoModule {}
