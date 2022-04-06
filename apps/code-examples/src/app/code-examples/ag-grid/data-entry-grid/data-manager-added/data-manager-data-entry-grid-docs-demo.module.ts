import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SkyAgGridModule } from '@skyux/ag-grid';
import { SkyDataManagerModule } from '@skyux/data-manager';
import { SkyCheckboxModule } from '@skyux/forms';
import { SkyToolbarModule } from '@skyux/layout';
import { SkySearchModule } from '@skyux/lookup';
import { SkyModalModule } from '@skyux/modals';
import { SkyDropdownModule } from '@skyux/popovers';

import { AgGridModule } from 'ag-grid-angular';

import { SkyDataManagerDataEntryGridContextMenuComponent } from './data-manager-data-entry-grid-docs-demo-context-menu.component';
import { SkyDataManagerDataEntryGridEditModalComponent } from './data-manager-data-entry-grid-docs-demo-edit-modal.component';
import { DataManagerDataEntryGridDocsDemoFiltersModalComponent } from './data-manager-data-entry-grid-docs-demo-filter-modal.component';
import { DataManagerDataEntryGridDocsDemoViewGridComponent } from './data-manager-data-entry-grid-docs-demo-view-grid.component';
import { SkyDataManagerDataEntryGridDemoComponent } from './data-manager-data-entry-grid-docs-demo.component';

@NgModule({
  declarations: [
    SkyDataManagerDataEntryGridContextMenuComponent,
    SkyDataManagerDataEntryGridDemoComponent,
    SkyDataManagerDataEntryGridEditModalComponent,
    DataManagerDataEntryGridDocsDemoFiltersModalComponent,
    DataManagerDataEntryGridDocsDemoViewGridComponent,
  ],
  imports: [
    AgGridModule.withComponents([
      SkyDataManagerDataEntryGridContextMenuComponent,
    ]),
    CommonModule,
    FormsModule,
    SkyToolbarModule,
    SkySearchModule,
    AgGridModule,
    SkyAgGridModule,
    SkyModalModule,
    SkyDropdownModule,
    SkyDataManagerModule,
    SkyCheckboxModule,
  ],
  exports: [SkyDataManagerDataEntryGridDemoComponent],
  entryComponents: [
    SkyDataManagerDataEntryGridEditModalComponent,
    DataManagerDataEntryGridDocsDemoFiltersModalComponent,
  ],
})
export class SkyDataManagerDataEntryGridDocsDemoModule {}
