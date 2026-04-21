import { Routes } from '@angular/router';

import { ChartBarDemoComponent } from './chart-bar-demo.component';

const BAR_CHART_ROUTES: Routes = [
  {
    path: '',
    component: ChartBarDemoComponent,
    title: 'Charts - Bar chart demo',
    data: {
      name: 'Bar chart',
      icon: 'bar-chart-horizontal',
      library: 'charts',
    },
  },
];

export default BAR_CHART_ROUTES;
