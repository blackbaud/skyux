import { Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'chart',
    loadComponent: () => import('./chart/chart-playground'),
    data: {
      name: 'Chart',
      icon: 'data-bar-horizontal',
      library: 'charts',
    },
  },
];

export default routes;
