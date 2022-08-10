import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SkyAgGridModule } from '@skyux/ag-grid';
import { SkyToolbarModule } from '@skyux/layout';

import { AgGridModule } from 'ag-grid-angular';

import { EditInModalGridRoutingModule } from '../edit-in-modal-grid/edit-in-modal-grid-routing.module';

import { EditableGridRoutingModule } from './editable-grid-routing.module';
import { EditableGridComponent } from './editable-grid.component';

@NgModule({
  declarations: [EditableGridComponent],
  imports: [
    AgGridModule,
    CommonModule,
    EditableGridRoutingModule,
    SkyAgGridModule,
    SkyToolbarModule,
  ],
})
export class EditableGridModule {
  public static routes = EditInModalGridRoutingModule.routes;
}
