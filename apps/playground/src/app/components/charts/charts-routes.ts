import { Routes } from '@angular/router';

const CHARTS_ROUTES: Routes = [
  {
    path: 'bar-chart-demos',
    loadChildren: () => import('./bar-chart-demo/bar-chart-routes'),
  },
  {
    path: 'line-chart-demos',
    loadChildren: () => import('./line-chart-demo/line-chart-routes'),
  },
  {
    path: 'pie-chart-demos',
    loadChildren: () => import('./pie-chart-demo/pie-chart-demo-routes'),
  },
];

export default CHARTS_ROUTES;
