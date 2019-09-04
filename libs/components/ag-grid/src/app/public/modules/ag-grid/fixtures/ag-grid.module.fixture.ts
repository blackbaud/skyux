import {
  NgModule
} from '@angular/core';

import {
  AgGridModule
} from 'ag-grid-angular';

import {
  SkyAgGridModule
} from '../ag-grid.module';

import {
  SkyAgGridFixtureComponent
} from './ag-grid.component.fixture';

@NgModule({
  imports: [
    AgGridModule,
    SkyAgGridModule
  ],
  declarations: [
    SkyAgGridFixtureComponent
  ],
  exports: [
    SkyAgGridFixtureComponent
  ]
})
export class SkyAgGridFixtureModule { }
