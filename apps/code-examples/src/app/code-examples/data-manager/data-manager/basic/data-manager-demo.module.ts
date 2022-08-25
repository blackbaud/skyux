import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SkyAgGridModule } from '@skyux/ag-grid';
import { SkyDataManagerModule } from '@skyux/data-manager';
import { SkyCheckboxModule } from '@skyux/forms';
import { SkyToolbarModule } from '@skyux/layout';
import { SkyRepeaterModule } from '@skyux/lists';
import { SkyModalModule } from '@skyux/modals';

import { AgGridModule } from 'ag-grid-angular';

import { DataManagerFiltersModalDemoComponent } from './data-filter-modal.component';
import { DataManagerDemoComponent } from './data-manager-demo.component';
import { DataViewGridDemoComponent } from './data-view-grid.component';
import { DataViewRepeaterDemoComponent } from './data-view-repeater.component';

@NgModule({
  declarations: [
    DataManagerDemoComponent,
    DataManagerFiltersModalDemoComponent,
    DataViewRepeaterDemoComponent,
    DataViewGridDemoComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    SkyCheckboxModule,
    SkyDataManagerModule,
    SkyAgGridModule,
    AgGridModule,
    SkyModalModule,
    SkyRepeaterModule,
    SkyToolbarModule,
  ],
  exports: [DataManagerDemoComponent],
})
export class DataManagerDemoModule {}
