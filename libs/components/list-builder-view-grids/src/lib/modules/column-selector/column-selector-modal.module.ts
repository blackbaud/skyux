import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SkyListModule, SkyListToolbarModule } from '@skyux/list-builder';
import { SkyListViewChecklistModule } from '@skyux/list-builder-view-checklist';
import { SkyModalModule } from '@skyux/modals';

import { SkyListBuilderViewGridsResourcesModule } from '../shared/sky-list-builder-view-grids-resources.module';

import { SkyColumnSelectorComponent } from './column-selector-modal.component';

/**
 * @deprecated List builder view grid and its features are deprecated. Use data entry grid instead. For more information, see https://developer.blackbaud.com/skyux/components/data-entry-grid.
 */
@NgModule({
  declarations: [SkyColumnSelectorComponent],
  imports: [
    CommonModule,
    SkyModalModule,
    SkyListBuilderViewGridsResourcesModule,
    SkyListModule,
    SkyListToolbarModule,
    SkyListViewChecklistModule,
  ],
})
export class SkyColumnSelectorModule {}
