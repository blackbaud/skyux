import { Routes } from '@angular/router';

const CHARTS_ROUTES: Routes = [
  {
    path: 'bar-chart-demos',
    loadChildren: () => import('./bar-chart-demo/bar-chart-demo-routes'),
  },
  {
    path: 'line-chart-demos',
    loadChildren: () => import('./line-chart-demo/line-chart-demo-routes'),
  },
  {
    path: 'donut-chart-demos',
    loadChildren: () => import('./donut-chart-demo/donut-chart-demo-routes'),
  },
];

export default CHARTS_ROUTES;
