import { Route } from '@angular/router';

export const routes: Route[] = [
  {
    path: '',
    redirectTo: '/page/layouts/blocks-with-links',
    pathMatch: 'full',
  },
  {
    path: 'action-hub',
    loadChildren: () =>
      import('./action-hub/action-hub.module').then((m) => m.ActionHubModule),
  },
  {
    path: 'page/layouts',
    loadChildren: () => import('./page/layouts/routes'),
  },
];
