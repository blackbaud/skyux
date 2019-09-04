import {
  NgModule
} from '@angular/core';

import {
  SkyToolbarModule
} from '@skyux/layout';

import {
  SkyAppLinkModule
} from '@skyux/router';

import {
  AgGridModule
} from 'ag-grid-angular';

import {
  SkyAgGridModule
} from './public';

@NgModule({
  declarations: [],
  exports: [
    AgGridModule,
    SkyAgGridModule,
    SkyAppLinkModule,
    SkyToolbarModule
  ],
  providers: [],
  entryComponents: []
})
export class AppExtrasModule { }
