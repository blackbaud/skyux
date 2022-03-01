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
import { SkyFilterModule } from '@skyux/lists';
import { SkyModalModule } from '@skyux/modals';

import { ListFilterDemoModalComponent } from './list-filters-demo-modal.component';
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
    SkyModalModule,
  ],
  declarations: [ListFiltersDemoComponent, ListFilterDemoModalComponent],
  entryComponents: [ListFilterDemoModalComponent],
  exports: [ListFiltersDemoComponent],
})
export class ListFiltersDemoModule {}
