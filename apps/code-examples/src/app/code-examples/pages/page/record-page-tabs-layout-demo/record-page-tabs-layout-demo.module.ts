import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SkyAgGridModule } from '@skyux/ag-grid';
import { SkyDataManagerModule } from '@skyux/data-manager';
import { SkyIconModule, SkyKeyInfoModule } from '@skyux/indicators';
import {
  SkyBoxModule,
  SkyDescriptionListModule,
  SkyFluidGridModule,
  SkyToolbarModule,
} from '@skyux/layout';
import { SkyRepeaterModule, SkySortModule } from '@skyux/lists';
import { SkySearchModule } from '@skyux/lookup';
import { SkyPageModule } from '@skyux/pages';
import { SkyDropdownModule } from '@skyux/popovers';
import { SkyTabsModule } from '@skyux/tabs';

import { AgGridModule } from 'ag-grid-angular';

import { AttachmentsGridContextMenuComponent } from './attachments-grid-context-menu.component';
import { RecordPageAttachmentsTabComponent } from './record-page-attachments-tab.component';
import { RecordPageContentComponent } from './record-page-content.component';
import { RecordPageNotesTabComponent } from './record-page-notes-tab.component';
import { RecordPageOverviewTabComponent } from './record-page-overview-tab.component';
import { RecordPageTabsLayoutDemoComponent } from './record-page-tabs-layout-demo.component';

@NgModule({
  declarations: [
    AttachmentsGridContextMenuComponent,
    RecordPageAttachmentsTabComponent,
    RecordPageContentComponent,
    RecordPageNotesTabComponent,
    RecordPageOverviewTabComponent,
    RecordPageTabsLayoutDemoComponent,
  ],
  exports: [RecordPageTabsLayoutDemoComponent],
  imports: [
    AgGridModule,
    CommonModule,
    SkyAgGridModule,
    SkyBoxModule,
    SkyDataManagerModule,
    SkyDescriptionListModule,
    SkyDropdownModule,
    SkyFluidGridModule,
    SkyIconModule,
    SkyKeyInfoModule,
    SkyPageModule,
    SkyRepeaterModule,
    SkySearchModule,
    SkySortModule,
    SkyTabsModule,
    SkyToolbarModule,
  ],
})
export class RecordPageTabsLayoutDemoModule {}
