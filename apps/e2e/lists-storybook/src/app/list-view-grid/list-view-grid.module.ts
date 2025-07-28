import { NgModule } from '@angular/core';
import { SkyToolbarModule } from '@skyux/layout';
import { SkyListModule, SkyListToolbarModule } from '@skyux/list-builder';
import { SkyListViewGridModule } from '@skyux/list-builder-view-grids';
import { SkyDropdownModule } from '@skyux/popovers';

import { ListViewGridComponent } from './list-view-grid.component';

@NgModule({
  imports: [
    SkyDropdownModule,
    SkyListViewGridModule,
    SkyListToolbarModule,
    SkyListModule,
    SkyToolbarModule,
  ],
  declarations: [ListViewGridComponent],
  exports: [ListViewGridComponent],
})
export class ListViewGridModule {}
