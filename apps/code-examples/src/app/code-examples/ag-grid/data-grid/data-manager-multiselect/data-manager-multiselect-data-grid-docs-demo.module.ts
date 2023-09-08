import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SkyAgGridModule } from '@skyux/ag-grid';
import { SkyDataManagerModule } from '@skyux/data-manager';

import { AgGridModule } from 'ag-grid-angular';

import { DataManagerMultiselectDataGridDemoViewGridComponent } from './data-manager-multiselect-data-grid-docs-demo-view-grid.component';
import { DataManagerMultiselectDataGridDemoComponent } from './data-manager-multiselect-data-grid-docs-demo.component';

@NgModule({
  declarations: [
    DataManagerMultiselectDataGridDemoComponent,
    DataManagerMultiselectDataGridDemoViewGridComponent,
  ],
  exports: [DataManagerMultiselectDataGridDemoComponent],
  imports: [AgGridModule, CommonModule, SkyAgGridModule, SkyDataManagerModule],
})
export class DataManagerMultiselectDataGridDemoModule {}
