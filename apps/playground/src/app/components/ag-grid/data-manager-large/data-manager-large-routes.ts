import { ComponentRouteInfo } from '../../../shared/component-info/component-route-info';

import { DataManagerLargeInModalComponent } from './data-manager-large-in-modal.component';
import { DataManagerLargeComponent } from './data-manager-large.component';

const routes: ComponentRouteInfo[] = [
  {
    path: '',
    pathMatch: 'full',
    component: DataManagerLargeComponent,
    data: {
      name: 'AG Grid (data manager large)',
      library: 'ag-grid',
      icon: 'table',
    },
  },
  {
    path: 'in-modal',
    component: DataManagerLargeInModalComponent,
    data: {
      name: 'AG Grid (data manager large, in modal)',
      library: 'ag-grid',
      icon: 'table',
    },
  },
];

export default routes;
