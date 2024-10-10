import { Provider, Type, inject } from '@angular/core';

import { SkyMediaQueryServiceOverride } from './media-query-service-override';
import { SKY_MEDIA_QUERY_SERVICE_OVERRIDE } from './media-query-service-override.token';
import { SkyMediaQueryService } from './media-query.service';

/**
 * @internal
 */
export function provideSkyMediaQueryServiceOverride(
  svc: Type<SkyMediaQueryService | SkyMediaQueryServiceOverride>,
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
