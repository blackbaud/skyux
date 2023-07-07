import { NgModule } from '@angular/core';
import { SkyAgGridModule } from '@skyux/ag-grid';
import { SkyDataManagerModule } from '@skyux/data-manager';
import { SkyIconModule, SkyKeyInfoModule } from '@skyux/indicators';
import { SkyPageModule } from '@skyux/pages';
import { SkyDropdownModule } from '@skyux/popovers';

import { AgGridModule } from 'ag-grid-angular';

import { DashboardGridContextMenuComponent } from './dashboards-grid-context-menu.component';
import { ListPageContentComponent } from './list-page-content.component';
import { ListPageListLayoutDemoComponent } from './list-page-list-layout-demo.component';

@NgModule({
  declarations: [
    ListPageListLayoutDemoComponent,
    DashboardGridContextMenuComponent,
    ListPageContentComponent,
  ],
  exports: [ListPageListLayoutDemoComponent],
  imports: [
    SkyPageModule,
    SkyDropdownModule,
    SkyAgGridModule,
    SkyDataManagerModule,
    SkyIconModule,
    AgGridModule,
    SkyKeyInfoModule,
  ],
})
export class ListPageListLayoutDemoModule {}
