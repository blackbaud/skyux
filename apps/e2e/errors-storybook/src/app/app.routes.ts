import { Route } from '@angular/router';

export const routes: Route[] = [
  {
    path: 'error',
    loadChildren: () =>
      import('./error/error.module').then((m) => m.ErrorModule),
  },
];
