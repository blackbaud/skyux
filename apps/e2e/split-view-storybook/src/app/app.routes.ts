import { Route } from '@angular/router';

export const routes: Route[] = [
  {
    path: 'split-view',
    loadChildren: () =>
      import('./split-view/split-view.module').then((m) => m.SplitViewModule),
  },
];
