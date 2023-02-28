import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SkyAgGridModule } from '@skyux/ag-grid';
import { SkyBackToTopModule } from '@skyux/layout';
import { SkyInfiniteScrollModule } from '@skyux/lists';
import { SkyModalModule } from '@skyux/modals';
import { SkyDropdownModule } from '@skyux/popovers';

import { AgGridModule } from 'ag-grid-angular';

import { ReadonlyGridContextMenuComponent } from './readonly-grid-context-menu.component';
import {
  ReadonlyGridInModalComponent,
  ReadonlyGridInModalModalComponent,
  ReadonlyGridInModalModalGridComponent,
  ReadonlyGridInModalModalNotGridComponent,
} from './readonly-grid-in-modal.component';
import { ReadonlyGridRoutingModule } from './readonly-grid-routing.module';
import { ReadonlyGridComponent } from './readonly-grid.component';

@NgModule({
  declarations: [
    ReadonlyGridComponent,
    ReadonlyGridContextMenuComponent,
    ReadonlyGridInModalComponent,
    ReadonlyGridInModalModalComponent,
    ReadonlyGridInModalModalGridComponent,
    ReadonlyGridInModalModalNotGridComponent,
  ],
  imports: [
    AgGridModule,
    CommonModule,
    ReadonlyGridRoutingModule,
    SkyAgGridModule,
    SkyInfiniteScrollModule,
    SkyDropdownModule,
    SkyBackToTopModule,
    SkyModalModule,
  ],
})
export class ReadonlyGridModule {
  public static routes = ReadonlyGridRoutingModule.routes;
}
