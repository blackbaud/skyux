import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SkyAgGridModule } from '@skyux/ag-grid';
import { SkyDataManagerModule } from '@skyux/data-manager';
import { SkyCheckboxModule } from '@skyux/forms';
import { SkyToolbarModule } from '@skyux/layout';
import { SkySearchModule } from '@skyux/lookup';
import { SkyDropdownModule } from '@skyux/popovers';

import { AgGridModule } from 'ag-grid-angular';

import { DataManagerDataEntryGridDemoViewGridComponent } from './data-manager-data-entry-grid-demo-view-grid.component';
import { DataManagerDataEntryGridDemoComponent } from './data-manager-data-entry-grid-demo.component';

@NgModule({
  declarations: [
    DataManagerDataEntryGridDemoComponent,
    DataManagerDataEntryGridDemoViewGridComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    SkyToolbarModule,
    SkySearchModule,
    AgGridModule,
    SkyAgGridModule,
    SkyDropdownModule,
    SkyDataManagerModule,
    SkyCheckboxModule,
  ],
  exports: [DataManagerDataEntryGridDemoComponent],
})
export class DataManagerDataEntryGridDemoModule {}
