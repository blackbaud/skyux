import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SkyListModule, SkyListToolbarModule } from '@skyux/list-builder';
import { SkyListViewGridModule } from '@skyux/list-builder-view-grids';
import { SkyDropdownModule } from '@skyux/popovers';

import { ListViewGridDemoComponent } from './list-view-grid-demo.component';

@NgModule({
  imports: [
    CommonModule,
    SkyDropdownModule,
    SkyListModule,
    SkyListToolbarModule,
    SkyListViewGridModule,
  ],
  declarations: [ListViewGridDemoComponent],
  exports: [ListViewGridDemoComponent],
})
export class ListViewGridDDemoModule {}
