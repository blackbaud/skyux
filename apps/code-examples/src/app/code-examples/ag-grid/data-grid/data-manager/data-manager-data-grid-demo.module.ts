import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SkyAgGridModule } from '@skyux/ag-grid';
import { SkyDataManagerModule } from '@skyux/data-manager';
import { SkyCheckboxModule } from '@skyux/forms';
import { SkyToolbarModule } from '@skyux/layout';
import { SkySearchModule } from '@skyux/lookup';
import { SkyModalModule } from '@skyux/modals';

import { AgGridModule } from 'ag-grid-angular';

import { DataManagerDataGridDemoViewGridComponent } from './data-manager-data-grid-demo-view-grid.component';
import { DataManagerDataGridDemoComponent } from './data-manager-data-grid-demo.component';

@NgModule({
  declarations: [
    DataManagerDataGridDemoComponent,
    DataManagerDataGridDemoViewGridComponent,
  ],
  exports: [DataManagerDataGridDemoComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SkyToolbarModule,
    SkySearchModule,
    SkyDataManagerModule,
    SkyAgGridModule,
    AgGridModule,
    SkyDataManagerModule,
    SkyModalModule,
    SkyCheckboxModule,
  ],
})
export class DataManagerDataGridDocsDemoModule {}
