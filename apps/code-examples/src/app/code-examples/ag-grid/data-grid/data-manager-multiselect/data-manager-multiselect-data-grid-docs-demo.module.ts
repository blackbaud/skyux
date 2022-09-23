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

import { DataManagerMultiselectDataGridDocsDemoFiltersModalComponent } from './data-manager-multiselect-data-grid-docs-demo-filter-modal.component';
import { DataManagerMultiselectDataGridDocsDemoViewGridComponent } from './data-manager-multiselect-data-grid-docs-demo-view-grid.component';
import { SkyDataManagerMultiselectDataGridDemoComponent } from './data-manager-multiselect-data-grid-docs-demo.component';

@NgModule({
  declarations: [
    SkyDataManagerMultiselectDataGridDemoComponent,
    DataManagerMultiselectDataGridDocsDemoFiltersModalComponent,
    DataManagerMultiselectDataGridDocsDemoViewGridComponent,
  ],
  exports: [SkyDataManagerMultiselectDataGridDemoComponent],
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
export class SkyDataManagerMultiselectDataGridDocsDemoModule {}
