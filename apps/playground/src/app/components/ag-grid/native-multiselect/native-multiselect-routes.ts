import { ComponentRouteInfo } from '../../../shared/component-info/component-route-info';

import { NativeMultiselectComponent } from './native-multiselect.component';

const routes: ComponentRouteInfo[] = [
  {
    path: '',
    component: NativeMultiselectComponent,
    data: {
      name: 'AG Grid (native multiselect)',
      library: 'ag-grid',
      icon: 'table',
    },
  },
];

export default routes;
