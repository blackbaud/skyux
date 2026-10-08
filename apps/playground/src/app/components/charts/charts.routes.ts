import { Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'chart',
    loadComponent: () => import('./chart/chart-playground'),
    data: {
      name: 'Charts: Wrapper',
      icon: 'data-bar-horizontal',
      library: 'charts',
    },
  },
  {
    path: 'chart-bar',
    loadComponent: () => import('./chart-bar/chart-bar-playground'),
    data: {
      name: 'Charts: Bar Chart',
      icon: 'data-bar-horizontal',
      library: 'charts',
    },
  },
  {
    path: 'chart-line',
    loadComponent: () => import('./chart-line/chart-line-playground'),
    data: {
      name: 'Charts: Line Chart',
      icon: 'data-line',
      library: 'charts',
    },
  },
];

export default routes;
