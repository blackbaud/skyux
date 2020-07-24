import {
  NgModule
} from '@angular/core';

import {
  CommonModule
} from '@angular/common';

import {
  AgGridModule
} from 'ag-grid-angular';

import {
  SkyDataManagerModule
} from '@skyux/data-manager';

import {
  SkyAgGridModule
} from '../ag-grid.module';

import {
  SkyAgGridDataManagerFixtureComponent
} from './ag-grid-data-manager.component.fixture';

import {
  SkyAgGridFixtureComponent
} from './ag-grid.component.fixture';

@NgModule({
  imports: [
    AgGridModule,
    CommonModule,
    SkyAgGridModule,
    SkyDataManagerModule
  ],
  declarations: [
    SkyAgGridDataManagerFixtureComponent,
    SkyAgGridFixtureComponent
  ],
  exports: [
    SkyAgGridDataManagerFixtureComponent,
    SkyAgGridFixtureComponent
  ]
})
export class SkyAgGridFixtureModule { }
