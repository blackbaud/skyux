import { NgModule } from '@angular/core';
import { SkyAgGridModule } from '@skyux/ag-grid';
import { SkyToolbarModule } from '@skyux/layout';
import { SkySearchModule } from '@skyux/lookup';
import { SkyModalModule } from '@skyux/modals';
import { SkyDropdownModule } from '@skyux/popovers';

import { AgGridModule } from '@ag-grid-community/angular';

import { SkyDataEntryGridContextMenuComponent } from './data-entry-grid-docs-demo-context-menu.component';
import { SkyDataEntryGridEditModalComponent } from './data-entry-grid-docs-demo-edit-modal.component';
import { SkyDataEntryGridDemoComponent } from './data-entry-grid-docs-demo.component';

@NgModule({
  declarations: [
    SkyDataEntryGridContextMenuComponent,
    SkyDataEntryGridDemoComponent,
    SkyDataEntryGridEditModalComponent,
  ],
  imports: [
    AgGridModule.withComponents([SkyDataEntryGridContextMenuComponent]),
    SkyToolbarModule,
    SkySearchModule,
    AgGridModule,
    SkyAgGridModule,
    SkyModalModule,
    SkyDropdownModule,
  ],
  exports: [SkyDataEntryGridDemoComponent],
})
export class SkyDataEntryGridDocsDemoModule {}
