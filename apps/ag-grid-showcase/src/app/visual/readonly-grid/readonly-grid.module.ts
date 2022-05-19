import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SkyAgGridModule } from '@skyux/ag-grid';
import { SkyInfiniteScrollModule } from '@skyux/lists';
import { SkyDropdownModule } from '@skyux/popovers';

import { AgGridModule } from 'ag-grid-angular';

import { ReadonlyGridContextMenuComponent } from './readonly-grid-context-menu.component';
import { ReadonlyGridRoutingModule } from './readonly-grid-routing.module';
import { ReadonlyGridComponent } from './readonly-grid.component';

@NgModule({
  declarations: [ReadonlyGridComponent, ReadonlyGridContextMenuComponent],
  imports: [
    AgGridModule,
    CommonModule,
    ReadonlyGridRoutingModule,
    SkyAgGridModule,
    SkyInfiniteScrollModule,
    SkyDropdownModule,
  ],
})
export class ReadonlyGridModule {}
