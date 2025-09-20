import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { ComponentRouteInfo } from '../../shared/component-info/component-route-info';

import {
  FilterVisualComponent,
  FilterVisualComponentModule,
} from './filter/filter-visual.component';
import {
  InfiniteScrollVisualComponent,
  InfiniteScrollVisualComponentModule,
} from './infinite-scroll/infinite-scroll-visual.component';
import {
  ListViewGridComponent,
  ListViewGridComponentModule,
} from './list-view-grid/list-view-grid.component';
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

const routes: ComponentRouteInfo[] = [
  {
    path: 'filter',
    component: FilterVisualComponent,
    data: {
      name: 'Filter',
      icon: 'filter',
      library: 'lists',
    },
  },
  {
    path: 'infinite-scroll',
    component: InfiniteScrollVisualComponent,
    data: {
      name: 'Infinite scroll',
      icon: 'arrow-repeat-all',
      library: 'lists',
    },
  },
  {
    path: 'list-view-grid',
    component: ListViewGridComponent,
    data: {
      name: 'List view grid',
      icon: 'table',
      library: 'lists',
    },
  },
  {
    path: 'paging',
    component: PagingVisualComponent,
    data: {
      name: 'Paging',
      icon: 'chevron-right',
      library: 'lists',
    },
  },
  {
    path: 'repeater',
    component: RepeaterVisualComponent,
    data: {
      name: 'Repeater (basic)',
      icon: 'chevron-down',
      library: 'lists',
    },
  },
  {
    path: 'nested-repeater',
    component: NestedRepeaterComponent,
    data: {
      name: 'Repeater (nested)',
      icon: 'chevron-down',
      library: 'lists',
    },
  },
  {
    path: 'sort',
    component: SortVisualComponent,
    data: {
      name: 'Sort',
      icon: 'arrow-sort',
      library: 'lists',
    },
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
    ListViewGridComponentModule,
    PagingVisualComponentModule,
    RepeaterVisualComponentModule,
    NestedRepeaterComponentModule,
    SortVisualComponentModule,
    ListsFeatureRoutingModule,
  ],
})
export class ListsFeatureModule {
  public static routes = routes;
}
