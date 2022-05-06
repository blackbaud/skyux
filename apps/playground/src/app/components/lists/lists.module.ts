import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import {
  FilterVisualComponent,
  FilterVisualComponentModule,
} from './filter/filter-visual.component';
import {
  InfiniteScrollVisualComponent,
  InfiniteScrollVisualComponentModule,
} from './infinite-scroll/infinite-scroll-visual.component';
import {
  PagingVisualComponent,
  PagingVisualComponentModule,
} from './paging/paging-visual.component';
import {
  NestedRepeaterComponent,
  NestedRepeaterComponentModule,
} from './repeater/nested-repeater.component';
import {
  RepeaterVisualComponent,
  RepeaterVisualComponentModule,
} from './repeater/repeater-visual.component';
import {
  SortVisualComponent,
  SortVisualComponentModule,
} from './sort/sort-visual.component';

const routes: Routes = [
  {
    path: 'filter',
    component: FilterVisualComponent,
  },
  {
    path: 'infinite-scroll',
    component: InfiniteScrollVisualComponent,
  },
  {
    path: 'paging',
    component: PagingVisualComponent,
  },
  {
    path: 'repeater',
    component: RepeaterVisualComponent,
  },
  {
    path: 'nested-repeater',
    component: NestedRepeaterComponent,
  },
  {
    path: 'sort',
    component: SortVisualComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ListsFeatureRoutingModule {}

@NgModule({
  imports: [
    FilterVisualComponentModule,
    InfiniteScrollVisualComponentModule,
    PagingVisualComponentModule,
    RepeaterVisualComponentModule,
    NestedRepeaterComponentModule,
    SortVisualComponentModule,
    ListsFeatureRoutingModule,
  ],
})
export class ListsFeatureModule {}
