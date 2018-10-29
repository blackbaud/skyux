import {
  NgModule
} from '@angular/core';

import {
  SkyGridModule
} from '@skyux/grids';

import {
  SkyListModule,
  SkyListToolbarModule
} from '@skyux/list-builder';
import {
  ListStateDispatcher,
  ListState
} from '@skyux/list-builder/modules/list/state';

import {
  SkyListViewChecklistModule
} from '@skyux/list-builder-view-checklist';

import {
  SkyListViewGridModule
} from './public/modules/list-view-grid/list-view-grid.module';
import {
  SkyColumnSelectorModule
} from './public/modules/column-selector';
import {
  SkyListColumnSelectorActionModule
} from './public/modules/list-column-selector-action';

@NgModule({
  imports: [
    SkyGridModule,
    SkyListModule,
    SkyListViewGridModule
  ],
  exports: [
    SkyGridModule,
    SkyListModule,
    SkyListViewGridModule,
    SkyColumnSelectorModule,
    SkyListColumnSelectorActionModule,
    SkyListToolbarModule,
    SkyListViewChecklistModule
  ],
  providers: [
    ListState,
    ListStateDispatcher
  ]
})
export class AppExtrasModule { }
