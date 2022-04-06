import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SkyAgGridModule } from '@skyux/ag-grid';
import { SkyToolbarModule } from '@skyux/layout';
import { SkySearchModule } from '@skyux/lookup';
import { SkyModalModule } from '@skyux/modals';

import { AgGridModule } from 'ag-grid-angular';

import { SkyAgGridDemoComponent } from './ag-grid-demo.component';
import { SkyAgGridEditModalComponent } from './ag-grid-edit-modal.component';
import { EditInModalGridRoutingModule } from './edit-in-modal-grid-routing.module';

@NgModule({
  declarations: [SkyAgGridDemoComponent, SkyAgGridEditModalComponent],
  imports: [
    AgGridModule,
    CommonModule,
    EditInModalGridRoutingModule,
    SkyAgGridModule,
    SkySearchModule,
    SkyToolbarModule,
    SkyModalModule,
  ],
})
export class EditInModalGridModule {}
