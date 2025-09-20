import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SkyCheckboxModule } from '@skyux/forms';
import { SkyIconModule } from '@skyux/icon';
import { SkyToolbarModule } from '@skyux/layout';
import { SkyFilterModule, SkySortModule } from '@skyux/lists';
import { SkySearchModule } from '@skyux/lookup';

import { SkyListFiltersModule } from '../list-filters/list-filters.module';
import { SkyListBuilderResourcesModule } from '../shared/sky-list-builder-resources.module';

import { SkyListMultiselectToolbarComponent } from './list-multiselect-toolbar.component';
import { SkyListToolbarItemRendererComponent } from './list-toolbar-item-renderer.component';
import { SkyListToolbarItemComponent } from './list-toolbar-item.component';
import { SkyListToolbarSearchActionsComponent } from './list-toolbar-search-actions.component';
import { SkyListToolbarSortComponent } from './list-toolbar-sort.component';
import { SkyListToolbarViewActionsComponent } from './list-toolbar-view-actions.component';
import { SkyListToolbarComponent } from './list-toolbar.component';

/**
 * @deprecated List builder and its features are deprecated. Use data manager instead. For more information, see https://developer.blackbaud.com/skyux/components/data-manager.
 */
@NgModule({
  declarations: [
    SkyListToolbarComponent,
    SkyListToolbarItemComponent,
    SkyListToolbarItemRendererComponent,
    SkyListMultiselectToolbarComponent,
    SkyListToolbarSearchActionsComponent,
    SkyListToolbarSortComponent,
    SkyListToolbarViewActionsComponent,
  ],
  imports: [
    CommonModule,
    SkyCheckboxModule,
    SkyToolbarModule,
    SkySearchModule,
    SkySortModule,
    SkyFilterModule,
    SkyListFiltersModule,
    SkyIconModule,
    SkyListBuilderResourcesModule,
  ],
  exports: [
    SkyListToolbarComponent,
    SkyListToolbarItemComponent,
    SkyListToolbarSearchActionsComponent,
    SkyListToolbarSortComponent,
    SkyListToolbarViewActionsComponent,
  ],
})
export class SkyListToolbarModule {}
