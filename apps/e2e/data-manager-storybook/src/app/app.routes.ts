import { Route } from '@angular/router';

export const routes: Route[] = [
  {
    path: 'data-manager',
    loadChildren: () =>
      import('./data-manager/data-manager.module').then(
        (m) => m.DataManagerModule,
      ),
  },
  {
    path: 'data-manager-with-list-toolbars',
    loadChildren: () =>
      import(
        './data-manager-with-list-toolbars/data-manager-with-list-toolbars.module'
      ).then((m) => m.DataManagerWithListToolbarsModule),
  },
];
