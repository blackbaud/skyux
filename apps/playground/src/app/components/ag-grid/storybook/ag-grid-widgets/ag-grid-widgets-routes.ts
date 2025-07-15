import { ComponentRouteInfo } from '../../../../shared/component-info/component-route-info';

import { AgGridWidgetsComponent } from './ag-grid-widgets.component';

const routes: ComponentRouteInfo[] = [
  {
    path: '',
    component: AgGridWidgetsComponent,
    data: {
      name: 'AG Grid (lookup focus)',
      library: 'ag-grid',
      icon: 'table',
    },
  },
];

export default routes;
