import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SkyAgGridModule } from '@skyux/ag-grid';
import { SkyToolbarModule } from '@skyux/layout';
import { SkyInfiniteScrollModule } from '@skyux/lists';
import { SkySearchModule } from '@skyux/lookup';
import { SkyDropdownModule } from '@skyux/popovers';
import { SkyTabsModule } from '@skyux/tabs';

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
    SkyTabsModule,
    SkyToolbarModule,
    SkySearchModule,
  ],
})
export class ReadonlyGridModule {
  public static routes = ReadonlyGridRoutingModule.routes;
}
