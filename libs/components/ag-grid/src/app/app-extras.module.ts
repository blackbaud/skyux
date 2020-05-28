import {
  NgModule
} from '@angular/core';

import {
  SkyDropdownModule
} from '@skyux/popovers';

import {
  SkyInfiniteScrollModule
} from '@skyux/lists';

import {
  SkyToolbarModule
} from '@skyux/layout';

import {
  SkySearchModule
} from '@skyux/lookup';

import {
  SkyModalModule
} from '@skyux/modals';

import {
  SkyAppLinkModule
} from '@skyux/router';

import {
  AgGridModule
} from 'ag-grid-angular';

import {
  SkyAgGridModule
} from './public';

import {
  SkyAgGridEditModalComponent
} from './visual/edit-in-modal-grid/ag-grid-edit-modal.component';

import {
  ReadonlyGridContextMenuComponent
} from './visual/readonly-grid/readonly-grid-context-menu.component';

@NgModule({
  declarations: [],
  imports: [
    AgGridModule.withComponents([ReadonlyGridContextMenuComponent])
  ],
  exports: [
    AgGridModule,
    SkyAgGridModule,
    SkyAppLinkModule,
    SkyDropdownModule,
    SkyInfiniteScrollModule,
    SkyModalModule,
    SkySearchModule,
    SkyToolbarModule
  ],
  providers: [],
  entryComponents: [
    SkyAgGridEditModalComponent
  ]
})
export class AppExtrasModule { }
