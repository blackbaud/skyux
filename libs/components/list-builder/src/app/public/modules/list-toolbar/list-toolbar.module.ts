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
  SkyListToolbarViewActionsComponent
} from './list-toolbar-view-actions.component';

@NgModule({
  declarations: [
    SkyListToolbarComponent,
    SkyListToolbarItemComponent,
    SkyListToolbarItemRendererComponent,
    SkyListToolbarSortComponent,
    SkyListToolbarViewActionsComponent
  ],
  imports: [
    CommonModule,
    SkyToolbarModule,
    SkySearchModule,
    SkySortModule,
    SkyFilterModule,
    SkyListFiltersModule,
    SkyIconModule
  ],
  exports: [
    SkyListToolbarComponent,
    SkyListToolbarItemComponent,
    SkyListToolbarItemRendererComponent,
    SkyListToolbarSortComponent,
    SkyListToolbarViewActionsComponent
  ]
})
export class SkyListToolbarModule {
}
