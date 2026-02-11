import { Routes } from '@angular/router';

import { BarChartDemoComponent } from './bar-chart-demo.component';

const BAR_CHART_ROUTES: Routes = [
  {
    path: '',
    component: BarChartDemoComponent,
    title: 'Charts - Bar chart demo',
    data: {
      name: 'Bar chart',
      icon: 'bar-chart-horizontal',
      library: 'charts',
    },
  },
];

export default BAR_CHART_ROUTES;
