import { Route } from '@angular/router';

export default [
  {
    path: 'action-hub',
    loadComponent: () => import('./action-hub/action-hub.component'),
  },
  {
    path: 'contacts',
    loadComponent: () => import('./contacts-page/contacts-page.component'),
  },
] as Route[];
