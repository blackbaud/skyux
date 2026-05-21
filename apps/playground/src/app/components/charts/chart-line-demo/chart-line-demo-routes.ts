import { Routes } from '@angular/router';

import { ChartLineDemoComponent } from './chart-line-demo.component';

const LINE_CHART_ROUTES: Routes = [
  {
    path: '',
    component: ChartLineDemoComponent,
    title: 'Charts - Line chart demo',
    data: {
      name: 'Line chart',
      icon: 'line-chart',
      library: 'charts',
    },
  },
];

export default LINE_CHART_ROUTES;
