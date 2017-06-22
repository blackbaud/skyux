import { Inject, Injectable, InjectionToken } from '@angular/core';

export interface StacheRouteMetadataConfig {
  path: string;
  name: string;
}

export const STACHE_ROUTE_METADATA_SERVICE_CONFIG
  = new InjectionToken<StacheRouteMetadataConfig[]>(
    'Injection token for StacheRouteMetadataService config.'
  );

@Injectable()
export class StacheRouteMetadataService {
  constructor(
    @Inject(STACHE_ROUTE_METADATA_SERVICE_CONFIG)
    public routes: any[]) { }
}

export let STACHE_ROUTE_METADATA_PROVIDERS: any[] = [
  { provide: STACHE_ROUTE_METADATA_SERVICE_CONFIG, useValue: [] },
  { provide: StacheRouteMetadataService, useClass: StacheRouteMetadataService }
];
