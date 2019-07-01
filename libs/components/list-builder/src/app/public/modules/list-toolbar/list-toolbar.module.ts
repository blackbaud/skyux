import {
  NgModule
} from '@angular/core';

import {
  CommonModule
} from '@angular/common';

import {
  SkyToolbarModule
} from '@skyux/layout';

import {
  SkySearchModule
} from '@skyux/lookup';

import {
  SkyFilterModule,
  SkySortModule
} from '@skyux/lists';

import {
  SkyCheckboxModule
} from '@skyux/forms';

import {
  SkyI18nModule
} from '@skyux/i18n';

import {
  SkyListFiltersModule
} from '../list-filters';

import {
  SkyIconModule
} from '@skyux/indicators';

import {
  SkyListToolbarComponent
} from './list-toolbar.component';

import {
  SkyListToolbarItemComponent
} from './list-toolbar-item.component';

import {
  SkyListToolbarItemRendererComponent
} from './list-toolbar-item-renderer.component';

import {
  SkyListToolbarSortComponent
} from './list-toolbar-sort.component';

import {
  SkyListMultiselectToolbarComponent
} from './list-multiselect-toolbar.component';

import {
  SkyListToolbarViewActionsComponent
} from './list-toolbar-view-actions.component';

import {
  SkyListBuilderResourcesModule
} from '../shared/list-builder-resources.module';

import {
  SkyListToolbarSearchActionsComponent
} from './list-toolbar-search-actions.component';

@NgModule({
  declarations: [
    SkyListToolbarComponent,
    SkyListToolbarItemComponent,
    SkyListToolbarItemRendererComponent,
    SkyListMultiselectToolbarComponent,
    SkyListToolbarSearchActionsComponent,
    SkyListToolbarSortComponent,
    SkyListToolbarViewActionsComponent
  ],
  imports: [
    CommonModule,
    SkyCheckboxModule,
    SkyI18nModule,
    SkyToolbarModule,
    SkySearchModule,
    SkySortModule,
    SkyFilterModule,
    SkyListFiltersModule,
    SkyIconModule,
    SkyListBuilderResourcesModule
  ],
  exports: [
    SkyListToolbarComponent,
    SkyListToolbarItemComponent,
    SkyListToolbarItemRendererComponent,
    SkyListMultiselectToolbarComponent,
    SkyListToolbarSearchActionsComponent,
    SkyListToolbarSortComponent,
    SkyListToolbarViewActionsComponent
  ]
})
export class SkyListToolbarModule { }
