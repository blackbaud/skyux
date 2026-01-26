import { Routes } from '@angular/router';

import { BarChartDemoComponent } from './bar-chart-demo.component';

const BAR_CHART_ROUTES: Routes = [
  {
    path: '',
    component: BarChartDemoComponent,
    data: {
      name: 'Bar chart (basic)',
      icon: 'bar-chart-horizontal',
      library: 'charts',
    },
  },
];

export default BAR_CHART_ROUTES;
