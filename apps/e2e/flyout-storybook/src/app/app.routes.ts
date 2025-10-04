import { Route } from '@angular/router';

export const routes: Route[] = [
  {
    path: 'flyout',
    loadChildren: () =>
      import('./flyout/flyout.module').then((m) => m.FlyoutModule),
  },
];
