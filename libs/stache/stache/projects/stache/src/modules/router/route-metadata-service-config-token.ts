import {
  InjectionToken
} from '@angular/core';

import {
  StacheRouteMetadataConfig
} from './route-metadata-config';

export const STACHE_ROUTE_METADATA_SERVICE_CONFIG = new InjectionToken<StacheRouteMetadataConfig[]>(
  'Injection token for StacheRouteMetadataService config.'
);
