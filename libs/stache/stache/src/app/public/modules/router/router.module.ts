import {
  NgModule
} from '@angular/core';

import {
  SkyAppConfig
} from '@skyux/config';

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
    SkyAppConfig,
    StacheRouteService,
    StacheRouteMetadataService,
    {
      provide: STACHE_ROUTE_METADATA_SERVICE_CONFIG,
      useValue: []
    }
  ]
})
export class StacheRouterModule { }
