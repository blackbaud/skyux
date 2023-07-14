import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SkyAgGridModule } from '@skyux/ag-grid';
import { SkyDataManagerModule } from '@skyux/data-manager';
import { SkyIconModule, SkyKeyInfoModule } from '@skyux/indicators';
import { SkyPageModule } from '@skyux/pages';
import { SkyDropdownModule } from '@skyux/popovers';
import { SkyTabsModule } from '@skyux/tabs';

import { AgGridModule } from 'ag-grid-angular';

import { ContactContextMenuComponent } from './contact-context-menu.component';
import { ListPageContactsGridComponent } from './list-page-contacts-grid.component';
import { ListPageContentComponent } from './list-page-content.component';
import { ListPageTabsLayoutDemoComponent } from './list-page-tabs-layout-demo.component';

@NgModule({
  declarations: [
    ContactContextMenuComponent,
    ListPageTabsLayoutDemoComponent,
    ListPageContentComponent,
    ListPageContactsGridComponent,
  ],
  exports: [ListPageTabsLayoutDemoComponent],
  imports: [
    CommonModule,
    SkyPageModule,
    SkyTabsModule,
    SkyDataManagerModule,
    SkyAgGridModule,
    AgGridModule,
    SkyKeyInfoModule,
    SkyDropdownModule,
    SkyIconModule,
  ],
})
export class ListPageTabsLayoutDemoModule {}
