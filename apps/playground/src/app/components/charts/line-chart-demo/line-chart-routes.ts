import { Routes } from '@angular/router';

import { LineChartDemoComponent } from './line-chart-demo.component';

const LINE_CHART_ROUTES: Routes = [
  {
    path: '',
    component: LineChartDemoComponent,
    data: {
      name: 'Line chart (basic)',
      icon: 'line-chart',
      library: 'charts',
    },
  },
];

export default LINE_CHART_ROUTES;
