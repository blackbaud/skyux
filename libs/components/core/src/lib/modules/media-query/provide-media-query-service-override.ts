import { Provider, Type, inject } from '@angular/core';

import { SKY_MEDIA_QUERY_SERVICE_OVERRIDE } from './media-query-service-override.token';
import { SkyMediaQueryService } from './media-query.service';

/**
 * @internal
 */
export function provideSkyMediaQueryServiceOverride(
  svc: Type<SkyMediaQueryService>,
): Provider[] {
  return [
    {
      provide: SkyMediaQueryService,
      useFactory: (): SkyMediaQueryService => {
        return (
          inject(SKY_MEDIA_QUERY_SERVICE_OVERRIDE, { optional: true }) ??
          inject(svc)
        );
      },
    },
  ];
}
