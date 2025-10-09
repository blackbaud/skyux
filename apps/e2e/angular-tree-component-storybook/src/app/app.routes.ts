import { Route } from '@angular/router';

export const routes: Route[] = [
  {
    path: 'angular-tree-component',
    loadChildren: () =>
      import('./angular-tree-component/angular-tree-component.module').then(
        (m) => m.AngularTreeComponentModule,
      ),
  },
];
