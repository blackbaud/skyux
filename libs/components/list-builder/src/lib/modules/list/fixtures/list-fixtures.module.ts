import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { SkyListFiltersModule } from '../../list-filters/list-filters.module';
import { SkyListToolbarModule } from '../../list-toolbar/list-toolbar.module';
import { SkyListModule } from '../list.module';

import { ListDualTestComponent } from './list-dual.component.fixture';
import { ListEmptyTestComponent } from './list-empty.component.fixture';
import { ListFilteredTestComponent } from './list-filtered.component.fixture';
import { ListSelectedTestComponent } from './list-selected.component.fixture';
import { ListViewTestComponent } from './list-view-test.component.fixture';
import { ListTestComponent } from './list.component.fixture';

@NgModule({
  declarations: [
    ListTestComponent,
    ListDualTestComponent,
    ListEmptyTestComponent,
    ListSelectedTestComponent,
    ListFilteredTestComponent,
    ListViewTestComponent,
  ],
  imports: [
    CommonModule,
    SkyListModule,
    SkyListFiltersModule,
    SkyListToolbarModule,
    FormsModule,
  ],
  exports: [
    ListTestComponent,
    ListDualTestComponent,
    ListEmptyTestComponent,
    ListSelectedTestComponent,
    ListFilteredTestComponent,
    ListViewTestComponent,
  ],
})
export class ListFixturesModule {}
