import { Route } from '@angular/router';

export const routes: Route[] = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'data-grid',
  },
  {
    path: 'data-grid',
    loadComponent: () => import('./data-grid/data-grid.component'),
  },
];
