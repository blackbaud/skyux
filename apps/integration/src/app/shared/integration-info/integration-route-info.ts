import { Route } from '@angular/router';

import { IntegrationInfo } from './integration-info';

export interface IntegrationRouteInfo extends Route {
  data: IntegrationInfo;
}
