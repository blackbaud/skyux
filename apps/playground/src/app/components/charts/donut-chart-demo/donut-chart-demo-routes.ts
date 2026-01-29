import { Routes } from '@angular/router';

import { DonutChartDemoComponent } from './donut-chart-demo.component';

const DONUT_CHART_ROUTES: Routes = [
  {
    path: '',
    component: DonutChartDemoComponent,
    data: {
      name: 'Pie chart (basic)',
      icon: 'pie-chart',
      library: 'charts',
    },
  },
];

export default DONUT_CHART_ROUTES;
