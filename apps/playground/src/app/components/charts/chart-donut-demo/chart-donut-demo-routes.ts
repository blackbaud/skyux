import { Routes } from '@angular/router';

import { ChartDonutDemoComponent } from './chart-donut-demo.component';

const DONUT_CHART_ROUTES: Routes = [
  {
    path: '',
    component: ChartDonutDemoComponent,
    title: 'Charts - Donut chart demo',
    data: {
      name: 'Donut chart',
      icon: 'donut-chart',
      library: 'charts',
    },
  },
];

export default DONUT_CHART_ROUTES;
