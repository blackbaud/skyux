import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SkyGridModule } from '@skyux/grids';
import { SkyWaitModule } from '@skyux/indicators';

import { SkyListColumnSelectorActionModule } from '../list-column-selector-action/list-column-selector-action.module';
import { SkyListBuilderViewGridsResourcesModule } from '../shared/sky-list-builder-view-grids-resources.module';

import { SkyListViewGridComponent } from './list-view-grid.component';

@NgModule({
  declarations: [SkyListViewGridComponent],
  imports: [
    CommonModule,
    SkyWaitModule,
    SkyGridModule,
    SkyListBuilderViewGridsResourcesModule,
  ],
  exports: [
    SkyListViewGridComponent,
    SkyListColumnSelectorActionModule,
    SkyGridModule,
  ],
})
export class SkyListViewGridModule {}
