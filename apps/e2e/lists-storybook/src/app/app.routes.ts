import { Route } from '@angular/router';

export const routes: Route[] = [
  {
    path: 'repeater',
    loadChildren: () =>
      import('./repeater/repeater.module').then((m) => m.RepeaterModule),
  },
  {
    path: 'paging',
    loadChildren: () =>
      import('./paging/paging.module').then((m) => m.PagingModule),
  },
  {
    path: 'sort',
    loadChildren: () => import('./sort/sort.module').then((m) => m.SortModule),
  },
  {
    path: 'infinite-scroll',
    loadChildren: () =>
      import('./infinite-scroll/infinite-scroll.module').then(
        (m) => m.InfiniteScrollModule,
      ),
  },
  {
    path: 'filter',
    loadChildren: () =>
      import('./filter/filter.module').then((m) => m.FilterModule),
  },
];
