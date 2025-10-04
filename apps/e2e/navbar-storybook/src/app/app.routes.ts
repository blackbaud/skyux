import { Route } from '@angular/router';

export const routes: Route[] = [
  {
    path: 'navbar',
    loadChildren: () =>
      import('./navbar/navbar.module').then((m) => m.NavbarModule),
  },
];
