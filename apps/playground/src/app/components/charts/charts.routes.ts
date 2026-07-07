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
  {
    path: 'chart-bar-basic',
    loadComponent: () => import('./chart-bar-basic/chart-bar-basic-playground'),
    data: {
      name: 'Chart bar - basic',
      icon: 'data-bar-horizontal',
      library: 'charts',
    },
  },
  {
    path: 'chart-bar-multiple-series',
    loadComponent: () =>
      import('./chart-bar-multiple-series/chart-bar-multiple-series-playground'),
    data: {
      name: 'Chart bar - multiple series',
      icon: 'data-bar-horizontal',
      library: 'charts',
    },
  },
  {
    path: 'chart-bar-dual-axis',
    loadComponent: () =>
      import('./chart-bar-dual-axis/chart-bar-dual-axis-playground'),
    data: {
      name: 'Chart bar - dual value axes',
      icon: 'data-bar-horizontal',
      library: 'charts',
    },
  },
  {
    path: 'chart-bar-horizontal',
    loadComponent: () =>
      import('./chart-bar-horizontal/chart-bar-horizontal-playground'),
    data: {
      name: 'Chart bar - horizontal',
      icon: 'data-bar-horizontal',
      library: 'charts',
    },
  },
  {
    path: 'chart-bar-hidden-labels',
    loadComponent: () =>
      import('./chart-bar-hidden-labels/chart-bar-hidden-labels-playground'),
    data: {
      name: 'Chart bar - hidden labels',
      icon: 'data-bar-horizontal',
      library: 'charts',
    },
  },
  {
    path: 'chart-bar-value-format',
    loadComponent: () =>
      import('./chart-bar-value-format/chart-bar-value-format-playground'),
    data: {
      name: 'Chart bar - value format',
      icon: 'data-bar-horizontal',
      library: 'charts',
    },
  },
];

export default routes;
