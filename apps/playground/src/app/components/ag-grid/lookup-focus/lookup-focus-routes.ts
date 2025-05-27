import { ComponentRouteInfo } from '../../../shared/component-info/component-route-info';

import { LookupFocusComponent } from './lookup-focus.component';

const routes: ComponentRouteInfo[] = [
  {
    path: '',
    component: LookupFocusComponent,
    data: {
      name: 'AG Grid (lookup focus)',
      library: 'ag-grid',
      icon: 'table',
    },
  },
];

export default routes;
