import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { SkyGridModule } from '@skyux/grids';
import { SkyListModule } from '@skyux/list-builder';

import { SkyListViewGridModule } from '../list-view-grid.module';

import { ListViewGridDisplayTestComponent } from './list-view-grid-display.component.fixture';
import { ListViewGridDynamicTestComponent } from './list-view-grid-dynamic.component.fixture';
import { ListViewGridEmptyTestComponent } from './list-view-grid-empty.component.fixture';
import { ListViewGridFixtureComponent } from './list-view-grid.component.fixture';

@NgModule({
  declarations: [
    ListViewGridFixtureComponent,
    ListViewGridDisplayTestComponent,
    ListViewGridEmptyTestComponent,
    ListViewGridDynamicTestComponent,
  ],
  imports: [
    CommonModule,
    SkyGridModule,
    SkyListViewGridModule,
    SkyListModule,
    NoopAnimationsModule,
  ],
  exports: [
    ListViewGridFixtureComponent,
    ListViewGridDisplayTestComponent,
    ListViewGridEmptyTestComponent,
    ListViewGridDynamicTestComponent,
  ],
})
export class ListViewGridFixturesModule {}
