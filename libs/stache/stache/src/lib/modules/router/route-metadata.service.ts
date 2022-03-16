import { Inject, Injectable } from '@angular/core';

import { numberConverter } from '../shared/input-converter';

import { STACHE_ROUTE_METADATA_SERVICE_CONFIG } from './route-metadata-service-config-token';

@Injectable()
export class StacheRouteMetadataService {
  constructor(
    @Inject(STACHE_ROUTE_METADATA_SERVICE_CONFIG)
    public metadata: any[]
  ) {
    this.metadata.forEach((route: any) => this.validateNavOrder(route));
  }

  private validateNavOrder(route: any): void {
    if (Object.prototype.hasOwnProperty.call(route, 'order')) {
      route.order = numberConverter(route.order);
      const isInteger = route.order === parseInt(route.order, 10);
      if (route.order <= 0 || !isInteger) {
        delete route.order;
      }
    }
  }
}
