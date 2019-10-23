import {
  CommonModule
} from '@angular/common';

import {
  NgModule
} from '@angular/core';

import {
  SkyListViewGridModule
} from '@skyux/list-builder-view-grids';

import {
  SkyListModule,
  SkyListToolbarModule
} from '../..';

import {
  ListViewSwitcherFixtureComponent
} from './list-view-switcher.component.fixture';

import {
  SkyListViewSwitcherModule
} from '../list-view-switcher.module';

import {
  ListViewSwitcherExtraCustomFixtureComponent
} from './list-view-switcher-extra-custom.component.fixture';

import {
  ListViewSwitcherOnlyCustomFixtureComponent
} from './list-view-switcher-only-custom.component.fixture';

import {
  ListViewSwitcherOnlyGridFixtureComponent
} from './list-view-switcher-only-grid.component.fixture';

import {
  ListViewSwitcherSecondaryViewFixtureComponent
} from './list-view-switcher-secondary-view.component.fixture';

@NgModule({
  declarations: [
    ListViewSwitcherExtraCustomFixtureComponent,
    ListViewSwitcherOnlyCustomFixtureComponent,
    ListViewSwitcherOnlyGridFixtureComponent,
    ListViewSwitcherSecondaryViewFixtureComponent,
    ListViewSwitcherFixtureComponent
  ],
  imports: [
    CommonModule,
    SkyListModule,
    SkyListToolbarModule,
    SkyListViewGridModule,
    SkyListViewSwitcherModule
  ],
  exports: [
    CommonModule,
    SkyListModule,
    SkyListToolbarModule,
    SkyListViewGridModule,
    SkyListViewSwitcherModule
  ]
})
export class SkySummaryActionBarFixtureModule { }
