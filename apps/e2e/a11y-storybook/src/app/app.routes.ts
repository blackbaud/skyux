import { Route } from '@angular/router';

export const routes: Route[] = [
  {
    path: 'skip-link',
    loadChildren: () =>
      import('./skip-link/skip-link.module').then((m) => m.SkipLinkModule),
  },
];
