import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./home/home.module').then((m) => m.HomeModule),
    title: 'Home',
  },
  {
    path: 'components',
    loadChildren: () =>
      import('./components/components.module').then((m) => m.ComponentsModule),
  },
];
