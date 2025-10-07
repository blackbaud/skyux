import { Route } from '@angular/router';

export const routes: Route[] = [
  {
    path: 'data-manager',
    loadChildren: () =>
      import('./data-manager/data-manager.module').then(
        (m) => m.DataManagerModule,
      ),
  },
];
