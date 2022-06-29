import { Route } from '@angular/router';

import { ComponentInfo } from './component-info';

export interface ComponentRouteInfo extends Route {
  data: ComponentInfo;
}
