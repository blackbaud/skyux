import { Route } from '@angular/router';

export const routes: Route[] = [
  {
    path: 'icons-by-row',
    loadComponent: () => import('./icons-by-row/icons-by-row.component'),
  },
  {
    path: 'icons',
    loadComponent: () => import('./icons/icons.component'),
  },
];
if (routes.length > 0 && routes.findIndex((r) => r.path === '') === -1) {
  routes.push({ path: '', redirectTo: `${routes[0].path}`, pathMatch: 'full' });
}
