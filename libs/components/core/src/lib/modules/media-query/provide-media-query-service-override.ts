import { Provider, Type, inject } from '@angular/core';

import { SkyMediaQueryServiceOverride } from './media-query-service-override';
import { SKY_MEDIA_QUERY_SERVICE_OVERRIDE } from './media-query-service-override.token';
import { SkyMediaQueryService } from './media-query.service';

/**
 * Overrides the `SkyMediaQueryService` provider, usually within an element injector.
 * @internal
 */
export function _provideSkyMediaQueryServiceOverride(
  svc: Type<SkyMediaQueryServiceOverride>,
): Provider[] {
  return [
    svc,
    {
      provide: SkyMediaQueryService,
      useFactory: (): SkyMediaQueryService => {
        return (inject(SKY_MEDIA_QUERY_SERVICE_OVERRIDE, { optional: true }) ??
          inject(svc)) as SkyMediaQueryService;
      },
    },
  ];
}
