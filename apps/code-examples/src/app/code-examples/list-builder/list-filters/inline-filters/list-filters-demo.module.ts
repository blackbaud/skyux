import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SkyIdModule } from '@skyux/core';
import { SkyCheckboxModule } from '@skyux/forms';
import {
  SkyListFiltersModule,
  SkyListModule,
  SkyListToolbarModule,
} from '@skyux/list-builder';
import { SkyListViewGridModule } from '@skyux/list-builder-view-grids';
import { SkyFilterModule } from '@skyux/lists';

import { ListFiltersDemoComponent } from './list-filters-demo.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    SkyCheckboxModule,
    SkyFilterModule,
    SkyIdModule,
    SkyListFiltersModule,
    SkyListModule,
    SkyListToolbarModule,
    SkyListViewGridModule,
  ],
  declarations: [ListFiltersDemoComponent],
  exports: [ListFiltersDemoComponent],
})
export class ListFiltersDemoModule {}
