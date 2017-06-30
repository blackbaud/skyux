import { Inject, Injectable, InjectionToken } from '@angular/core';

import { numberConverter } from './input-converter';

export interface StacheRouteMetadataConfig {
  path: string;
  name: string;
  order?: number;
}

export const STACHE_ROUTE_METADATA_SERVICE_CONFIG
  = new InjectionToken<StacheRouteMetadataConfig[]>(
    'Injection token for StacheRouteMetadataService config.'
  );

@Injectable()
export class StacheRouteMetadataService {
  constructor(
    @Inject(STACHE_ROUTE_METADATA_SERVICE_CONFIG)
    public metadata: any[]) {
      this.metadata.forEach(route => {
        if (route.order) {
          route.order = numberConverter(route.order);
        }
      });
    }
}

export let STACHE_ROUTE_METADATA_PROVIDERS: any[] = [
  { provide: STACHE_ROUTE_METADATA_SERVICE_CONFIG, useValue: [] },
  { provide: StacheRouteMetadataService, useClass: StacheRouteMetadataService }
];
