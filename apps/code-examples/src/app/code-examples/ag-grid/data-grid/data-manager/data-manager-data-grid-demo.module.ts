import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SkyAgGridModule } from '@skyux/ag-grid';
import { SkyDataManagerModule } from '@skyux/data-manager';

import { AgGridModule } from 'ag-grid-angular';

import { DataManagerDataGridDemoViewGridComponent } from './data-manager-data-grid-demo-view-grid.component';
import { DataManagerDataGridDemoComponent } from './data-manager-data-grid-demo.component';

@NgModule({
  declarations: [
    DataManagerDataGridDemoComponent,
    DataManagerDataGridDemoViewGridComponent,
  ],
  exports: [DataManagerDataGridDemoComponent],
  imports: [AgGridModule, CommonModule, SkyAgGridModule, SkyDataManagerModule],
})
export class DataManagerDataGridDocsDemoModule {}
