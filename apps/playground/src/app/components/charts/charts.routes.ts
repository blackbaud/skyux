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
    path: 'chart-pie',
    loadComponent: () => import('./chart-pie/chart-pie-playground'),
    data: {
      name: 'Charts: Pie Chart',
      icon: 'data-pie',
      library: 'charts',
    },
  },
];

export default routes;
