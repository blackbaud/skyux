import {
  NgModule
} from '@angular/core';

import {
  CommonModule
} from '@angular/common';

import {
  SkyListModule,
  SkyListToolbarModule
} from '@skyux/list-builder';

import {
  SkyListViewGridModule
} from 'projects/list-builder-view-grids/src/public-api';

import {
  SkyDropdownModule
} from '@skyux/popovers';

import {
  ListViewGridDemoComponent
} from './list-view-grid-demo.component';

@NgModule({
  imports: [
    CommonModule,
    SkyDropdownModule,
    SkyListModule,
    SkyListToolbarModule,
    SkyListViewGridModule
  ],
  declarations: [
    ListViewGridDemoComponent
  ],
  exports: [
    ListViewGridDemoComponent
  ]
})
export class ListViewGridDDemoModule { }
