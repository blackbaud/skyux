import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SkyAgGridModule } from '@skyux/ag-grid';
import {
  SkyDataManagerModule,
  SkyDataManagerService,
} from '@skyux/data-manager';
import { SkyToolbarModule } from '@skyux/layout';
import { SkyPagingModule } from '@skyux/lists';
import { SkySearchModule } from '@skyux/lookup';

import { AgGridModule } from 'ag-grid-angular';

import { DataGridPagingDemoComponent } from './data-grid-paging-demo.component';

@NgModule({
  declarations: [DataGridPagingDemoComponent],
  exports: [DataGridPagingDemoComponent],
  imports: [
    CommonModule,
    SkyToolbarModule,
    SkySearchModule,
    SkyDataManagerModule,
    SkyAgGridModule,
    AgGridModule,
    SkyPagingModule,
  ],
  providers: [SkyDataManagerService],
})
export class DataGridPagingDemoModule {}
