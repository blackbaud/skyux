import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SkyAgGridModule } from '@skyux/ag-grid';
import { SkyDataManagerModule } from '@skyux/data-manager';
import { SkyCheckboxModule } from '@skyux/forms';
import { SkyRepeaterModule } from '@skyux/lists';
import { SkyModalModule } from '@skyux/modals';

import { AgGridModule } from 'ag-grid-angular';

import { SkyDataManagerFiltersModalVisualComponent } from './data-filter-modal.component';
import { DataManagerRoutingModule } from './data-manager-routing.module';
import { DataManagerVisualComponent } from './data-manager-visual.component';
import { DataViewGridComponent } from './data-view-grid.component';
import { DataViewRepeaterComponent } from './data-view-repeater.component';

@NgModule({
  declarations: [
    DataManagerVisualComponent,
    DataViewRepeaterComponent,
    DataViewGridComponent,
    SkyDataManagerFiltersModalVisualComponent,
  ],
  imports: [
    AgGridModule,
    CommonModule,
    DataManagerRoutingModule,
    SkyAgGridModule,
    SkyDataManagerModule,
    SkyRepeaterModule,
    SkyModalModule,
    SkyCheckboxModule,
    FormsModule,
  ],
})
export class DataManagerModule {}
