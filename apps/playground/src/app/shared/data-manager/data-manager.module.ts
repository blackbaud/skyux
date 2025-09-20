import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SkyAgGridModule } from '@skyux/ag-grid';
import { SkyDataManagerModule } from '@skyux/data-manager';
import { SkyCheckboxModule } from '@skyux/forms';
import { SkyToolbarModule } from '@skyux/layout';
import { SkySearchModule } from '@skyux/lookup';
import { SkyDropdownModule } from '@skyux/popovers';

import { AgGridModule } from 'ag-grid-angular';
import { AllCommunityModule } from 'ag-grid-community';
import { ModuleRegistry } from 'ag-grid-community';

import { DataManagerMenuComponent } from './data-manager-context-menu.component';
import { DataManagerViewGridComponent } from './data-manager-view-grid.component';
import { DataManagerComponent } from './data-manager.component';

ModuleRegistry.registerModules([AllCommunityModule]);

/**
 * An example data manager to use in other examples.
 */
@NgModule({
  declarations: [
    DataManagerMenuComponent,
    DataManagerComponent,
    DataManagerViewGridComponent,
  ],
  imports: [
    FormsModule,
    SkyToolbarModule,
    SkySearchModule,
    AgGridModule,
    SkyAgGridModule,
    SkyDropdownModule,
    SkyDataManagerModule,
    SkyCheckboxModule,
  ],
  exports: [DataManagerComponent],
})
export class DataManagerModule {}
