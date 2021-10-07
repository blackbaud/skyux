import {
  NgModule
} from '@angular/core';

import {
  StacheRouteMetadataService
} from './route-metadata.service';

import {
  StacheRouteService
} from './route.service';

import {
  STACHE_ROUTE_METADATA_SERVICE_CONFIG
} from './route-metadata-service-config-token';

@NgModule({
  providers: [
    StacheRouteService,
    StacheRouteMetadataService,
    {
      provide: STACHE_ROUTE_METADATA_SERVICE_CONFIG,
      useValue: []
    }
  ]
})
export class StacheRouterModule { }
