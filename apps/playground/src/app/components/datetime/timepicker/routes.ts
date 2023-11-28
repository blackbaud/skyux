import { ComponentRouteInfo } from '../../../shared/component-info/component-route-info';

import { TimepickerComponent } from './timepicker.component';

const routes: ComponentRouteInfo[] = [
  {
    path: '',
    component: TimepickerComponent,
    data: {
      name: 'Timepicker',
      icon: 'clock',
      library: 'datetime',
    },
  },
];

export default routes;
