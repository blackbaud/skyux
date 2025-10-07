import { Route } from '@angular/router';

export const routes: Route[] = [
  {
    path: 'tile-dashboard',
    loadChildren: () =>
      import('./tile-dashboard/tile-dashboard.module').then(
        (m) => m.TileDashboardModule,
      ),
  },
];
