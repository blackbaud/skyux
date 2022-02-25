import { NgModule } from '@angular/core';

import { CommonModule } from '@angular/common';

import { FormsModule } from '@angular/forms';

import { SkyIdModule } from '@skyux/core';

import { SkyCheckboxModule } from '@skyux/forms';

import {
  SkyListFiltersModule,
  SkyListModule,
  SkyListToolbarModule,
} from 'projects/list-builder/src/public-api';

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
  ],
  declarations: [ListFiltersDemoComponent],
  exports: [ListFiltersDemoComponent],
})
export class ListFiltersDemoModule {}
