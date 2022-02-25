import { NgModule } from '@angular/core';

import { CommonModule } from '@angular/common';

import { SkyListModule, SkyListToolbarModule } from '@skyux/list-builder';

import { SkyListViewGridModule } from 'projects/list-builder-view-grids/src/public-api';

import { ListViewGridDemoComponent } from './list-view-grid-demo.component';

@NgModule({
  imports: [
    CommonModule,
    SkyListModule,
    SkyListToolbarModule,
    SkyListViewGridModule,
  ],
  declarations: [ListViewGridDemoComponent],
  exports: [ListViewGridDemoComponent],
})
export class ListViewGridDemoModule {}
