import { Routes } from '@angular/router';

import { DonutChartDemoComponent } from './donut-chart-demo.component';

const DONUT_CHART_ROUTES: Routes = [
  {
    path: '',
    component: DonutChartDemoComponent,
    data: {
      name: 'Donut chart',
      icon: 'donut-chart',
      library: 'charts',
    },
  },
];

export default DONUT_CHART_ROUTES;
