import { Routes } from '@angular/router';

import { PieChartDemoComponent } from './pie-chart-demo.component';

const PIE_CHART_ROUTES: Routes = [
  {
    path: '',
    component: PieChartDemoComponent,
    data: {
      name: 'Pie chart (basic)',
      icon: 'pie-chart',
      library: 'charts',
    },
  },
];

export default PIE_CHART_ROUTES;
