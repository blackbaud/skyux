import { NgModule } from '@angular/core';

import { STACHE_ROUTE_METADATA_SERVICE_CONFIG } from './route-metadata-service-config-token';
import { StacheRouteMetadataService } from './route-metadata.service';
import { StacheRouteService } from './route.service';

@NgModule({
  providers: [
    StacheRouteService,
    StacheRouteMetadataService,
    {
      provide: STACHE_ROUTE_METADATA_SERVICE_CONFIG,
      useValue: [],
    },
  ],
})
export class StacheRouterModule {}
