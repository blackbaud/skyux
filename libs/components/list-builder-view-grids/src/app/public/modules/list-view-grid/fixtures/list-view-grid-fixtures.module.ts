import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import {
  SkyGridModule
} from '@skyux/grids';
import {
  SkyListModule
} from '@skyux/list-builder';

import { SkyListViewGridModule } from '../list-view-grid.module';
import { ListViewGridTestComponent } from './list-view-grid.component.fixture';
import { ListViewGridDisplayTestComponent } from './list-view-grid-display.component.fixture';
import { ListViewGridEmptyTestComponent } from './list-view-grid-empty.component.fixture';
import { ListViewGridDynamicTestComponent } from './list-view-grid-dynamic.component.fixture';

@NgModule({
  declarations: [
    ListViewGridTestComponent,
    ListViewGridDisplayTestComponent,
    ListViewGridEmptyTestComponent,
    ListViewGridDynamicTestComponent
  ],
  imports: [
    CommonModule,
    SkyGridModule,
    SkyListViewGridModule,
    SkyListModule
  ],
  exports: [
    ListViewGridTestComponent,
    ListViewGridDisplayTestComponent,
    ListViewGridEmptyTestComponent,
    ListViewGridDynamicTestComponent
  ]
})
export class ListViewGridFixturesModule { }
