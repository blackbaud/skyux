import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SkyAgGridModule } from '@skyux/ag-grid';
import { SkyDataManagerModule } from '@skyux/data-manager';
import { SkyCheckboxModule } from '@skyux/forms';
import { SkyToolbarModule } from '@skyux/layout';
import { SkySearchModule } from '@skyux/lookup';
import { SkyModalModule } from '@skyux/modals';

import { AgGridModule } from '@ag-grid-community/angular';

import { DataManagerDataGridDocsDemoFiltersModalComponent } from './data-manager-data-grid-docs-demo-filter-modal.component';
import { DataManagerDataGridsDocsDemoViewGridComponent } from './data-manager-data-grid-docs-demo-view-grid.component';
import { SkyDataManagerDataGridDemoComponent } from './data-manager-data-grid-docs-demo.component';

@NgModule({
  declarations: [
    SkyDataManagerDataGridDemoComponent,
    DataManagerDataGridDocsDemoFiltersModalComponent,
    DataManagerDataGridsDocsDemoViewGridComponent,
  ],
  exports: [SkyDataManagerDataGridDemoComponent],
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
export class SkyDataManagerDataGridDocsDemoModule {}
