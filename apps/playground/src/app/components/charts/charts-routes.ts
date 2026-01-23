import { Routes } from '@angular/router';

const CHARTS_ROUTES: Routes = [
  {
    path: 'bar-chart-demos',
    loadChildren: () => import('./bar-chart-demo/bar-chart-routes'),
  },
];

export default CHARTS_ROUTES;
