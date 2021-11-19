import { NgModule } from '@angular/core';

import { CommonModule } from '@angular/common';

import { SkyBackToTopModule } from '@skyux/layout';

import { SkyListModule } from '@skyux/list-builder';

import { SkyListViewGridModule } from '@skyux/list-builder-view-grids';

import { SkyInfiniteScrollModule } from '@skyux/lists';

import { InfiniteScrollDemoComponent } from './infinite-scroll-demo.component';

@NgModule({
  imports: [
    CommonModule,
    SkyBackToTopModule,
    SkyInfiniteScrollModule,
    SkyListModule,
    SkyListViewGridModule,
  ],
  declarations: [InfiniteScrollDemoComponent],
  exports: [InfiniteScrollDemoComponent],
})
export class InfiniteScrollDemoModule {}
