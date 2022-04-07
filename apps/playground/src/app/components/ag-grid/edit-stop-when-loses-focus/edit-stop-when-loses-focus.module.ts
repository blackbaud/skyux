import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SkyAgGridModule } from '@skyux/ag-grid';
import { SkyToolbarModule } from '@skyux/layout';

import { AgGridModule } from 'ag-grid-angular';

import { EditStopWhenLosesFocusRoutingModule } from './edit-stop-when-loses-focus-routing.module';
import { EditStopWhenLosesFocusComponent } from './edit-stop-when-loses-focus.component';

@NgModule({
  declarations: [EditStopWhenLosesFocusComponent],
  imports: [
    AgGridModule,
    CommonModule,
    EditStopWhenLosesFocusRoutingModule,
    SkyAgGridModule,
    SkyToolbarModule,
  ],
})
export class EditStopWhenLosesFocusModule {}
