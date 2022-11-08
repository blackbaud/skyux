import { NgModule } from '@angular/core';
import { SkyAgGridModule } from '@skyux/ag-grid';
import { SkyHelpInlineModule } from '@skyux/indicators';
import { SkyToolbarModule } from '@skyux/layout';
import { SkySearchModule } from '@skyux/lookup';
import { SkyModalModule } from '@skyux/modals';
import { SkyDropdownModule } from '@skyux/popovers';

import { AgGridModule } from 'ag-grid-angular';

import { SkyDataEntryGridContextMenuComponent } from './data-entry-grid-docs-demo-context-menu.component';
import { SkyDataEntryGridEditModalComponent } from './data-entry-grid-docs-demo-edit-modal.component';
import { SkyDataEntryGridDemoComponent } from './data-entry-grid-docs-demo.component';
import { InlineHelpComponent } from './inline-help.component';

@NgModule({
  declarations: [
    SkyDataEntryGridContextMenuComponent,
    SkyDataEntryGridDemoComponent,
    SkyDataEntryGridEditModalComponent,
    InlineHelpComponent,
  ],
  imports: [
    SkyToolbarModule,
    SkySearchModule,
    AgGridModule,
    SkyAgGridModule,
    SkyModalModule,
    SkyDropdownModule,
    SkyHelpInlineModule,
  ],
  exports: [SkyDataEntryGridDemoComponent],
})
export class SkyDataEntryGridDocsDemoModule {}
