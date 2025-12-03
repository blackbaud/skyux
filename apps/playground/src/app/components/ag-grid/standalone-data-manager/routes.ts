import { ComponentRouteInfo } from '../../../shared/component-info/component-route-info';

import { DataManagerVisualComponent } from './data-manager-visual.component';

export default [
  {
    path: '',
    component: DataManagerVisualComponent,
    data: {
      name: 'AG Grid (easy data manager)',
      library: 'ag-grid',
      icon: 'table',
    },
  },
] as ComponentRouteInfo[];
