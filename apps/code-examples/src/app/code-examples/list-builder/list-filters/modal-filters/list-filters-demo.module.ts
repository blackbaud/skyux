import { NgModule } from '@angular/core';

import { CommonModule } from '@angular/common';

import { FormsModule } from '@angular/forms';

import { SkyIdModule } from '@skyux/core';

import { SkyCheckboxModule } from '@skyux/forms';

import {
  SkyListFiltersModule,
  SkyListModule,
  SkyListToolbarModule,
} from '@skyux/list-builder';

import { SkyFilterModule } from '@skyux/lists';

import { SkyModalModule } from '@skyux/modals';

import { ListFiltersDemoComponent } from './list-filters-demo.component';

import { ListFilterDemoModalComponent } from './list-filters-demo-modal.component';

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
    SkyModalModule,
  ],
  declarations: [ListFiltersDemoComponent, ListFilterDemoModalComponent],
  entryComponents: [ListFilterDemoModalComponent],
  exports: [ListFiltersDemoComponent],
})
export class ListFiltersDemoModule {}
