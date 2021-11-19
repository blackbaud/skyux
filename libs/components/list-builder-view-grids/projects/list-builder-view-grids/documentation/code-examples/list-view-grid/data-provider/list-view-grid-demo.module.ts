import { NgModule } from '@angular/core';

import { CommonModule } from '@angular/common';

import { FormsModule } from '@angular/forms';

import { SkyIdModule } from '@skyux/core';

import { SkyCheckboxModule } from '@skyux/forms';

import {
  SkyListFiltersModule,
  SkyListModule,
  SkyListPagingModule,
  SkyListToolbarModule,
} from '@skyux/list-builder';

import { SkyListViewGridModule } from 'projects/list-builder-view-grids/src/public-api';

import { ListViewGridDemoComponent } from './list-view-grid-demo.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    SkyCheckboxModule,
    SkyIdModule,
    SkyListFiltersModule,
    SkyListModule,
    SkyListPagingModule,
    SkyListToolbarModule,
    SkyListViewGridModule,
  ],
  declarations: [ListViewGridDemoComponent],
  exports: [ListViewGridDemoComponent],
})
export class ListViewGridDemoModule {}
