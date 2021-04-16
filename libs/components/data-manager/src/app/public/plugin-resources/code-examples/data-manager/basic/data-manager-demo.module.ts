import {
  AgGridModule
} from 'ag-grid-angular';

import {
  CommonModule
} from '@angular/common';

import {
  NgModule
} from '@angular/core';

import {
  FormsModule
} from '@angular/forms';

import {
  SkyAgGridModule
} from '@skyux/ag-grid';

import {
  SkyCardModule,
  SkyToolbarModule
} from '@skyux/layout';

import {
  SkyCheckboxModule
} from '@skyux/forms';

import {
  SkyDataManagerModule
} from '@skyux/data-manager';

import {
  SkyModalModule
} from '@skyux/modals';

import {
  SkyRepeaterModule
} from '@skyux/lists';

import {
  DataManagerDemoComponent
} from './data-manager-demo.component';

import {
  DataManagerFiltersModalDemoComponent
} from './data-filter-modal.component';

import {
  DataViewCardsDemoComponent
} from './data-view-cards.component';

import {
  DataViewRepeaterDemoComponent
} from './data-view-repeater.component';

@NgModule({
  declarations: [
    DataManagerDemoComponent,
    DataManagerFiltersModalDemoComponent,
    DataViewCardsDemoComponent,
    DataViewRepeaterDemoComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    AgGridModule,
    SkyAgGridModule,
    SkyCardModule,
    SkyCheckboxModule,
    SkyDataManagerModule,
    SkyModalModule,
    SkyRepeaterModule,
    SkyToolbarModule
  ],
  exports: [
    DataManagerDemoComponent
  ],
  entryComponents: [
    DataManagerDemoComponent,
    DataManagerFiltersModalDemoComponent
  ]
})
export class DataManagerDemoModule { }
