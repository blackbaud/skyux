import {
  NgModule
} from '@angular/core';

import {
  CommonModule
} from '@angular/common';

import {
  NoopAnimationsModule
} from '@angular/platform-browser/animations';

import {
  AgGridModule
} from 'ag-grid-angular';

import {
  SkyDataManagerModule
} from '@skyux/data-manager';

import {
  SkyAgGridFixtureComponent
} from './ag-grid.component.fixture';

import {
  SkyAgGridModule
} from '../ag-grid.module';

import {
  SkyAgGridDataManagerFixtureComponent
} from './ag-grid-data-manager.component.fixture';

import {
  SkyAgGridRowDeleteFixtureComponent
} from './ag-grid-row-delete.component.fixture';

@NgModule({
  imports: [
    AgGridModule,
    CommonModule,
    SkyAgGridModule,
    SkyDataManagerModule,
    NoopAnimationsModule
  ],
  declarations: [
    SkyAgGridDataManagerFixtureComponent,
    SkyAgGridFixtureComponent,
    SkyAgGridRowDeleteFixtureComponent
  ],
  exports: [
    SkyAgGridDataManagerFixtureComponent,
    SkyAgGridFixtureComponent,
    SkyAgGridRowDeleteFixtureComponent
  ]
})
export class SkyAgGridFixtureModule { }
