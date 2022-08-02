import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import {
  SkyFilterModule,
  SkyInfiniteScrollModule,
  SkyPagingModule,
  SkyRepeaterModule,
  SkySortModule,
} from '@skyux/lists';
import { SkyDropdownModule } from '@skyux/popovers';

import { FilterVisualComponent } from './filter/filter-visual.component';
import { InfiniteScrollVisualComponent } from './infinite-scroll/infinite-scroll-visual.component';
import { PagingVisualComponent } from './paging/paging-visual.component';
import { RepeaterVisualComponent } from './repeater/repeater-visual.component';
import { SortVisualComponent } from './sort/sort-visual.component';
import { VisualComponent } from './visual.component';

@NgModule({
  declarations: [
    FilterVisualComponent,
    InfiniteScrollVisualComponent,
    PagingVisualComponent,
    RepeaterVisualComponent,
    SortVisualComponent,
    VisualComponent,
  ],
  imports: [
    CommonModule,
    RouterModule,
    SkyDropdownModule,
    SkyFilterModule,
    SkyInfiniteScrollModule,
    SkyPagingModule,
    SkyRepeaterModule,
    SkySortModule,
  ],
  exports: [
    FilterVisualComponent,
    InfiniteScrollVisualComponent,
    PagingVisualComponent,
    RepeaterVisualComponent,
    SortVisualComponent,
    VisualComponent,
  ],
})
export class VisualModule {}
