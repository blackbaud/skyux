import { Routes } from '@angular/router';

const CHARTS_ROUTES: Routes = [
  {
    path: 'chart-bar-demos',
    loadChildren: () => import('./chart-bar-demo/chart-bar-demo-routes'),
  },
  {
    path: 'chart-line-demos',
    loadChildren: () => import('./chart-line-demo/chart-line-demo-routes'),
  },
  {
    path: 'chart-donut-demos',
    loadChildren: () => import('./chart-donut-demo/chart-donut-demo-routes'),
  },
];

export default CHARTS_ROUTES;
