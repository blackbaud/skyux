import {
  NgModule
} from '@angular/core';

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

@NgModule({
  declarations: [],
  exports: [
    AgGridModule,
    SkyAgGridModule,
    SkyAppLinkModule,
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
