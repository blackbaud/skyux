import { InjectionToken } from '@angular/core';

import { SkyMediaQueryService } from './media-query.service';

/**
 * @internal
 */
export const SKY_MEDIA_QUERY_SERVICE_OVERRIDE =
  new InjectionToken<SkyMediaQueryService>('SKY_MEDIA_QUERY_SERVICE_OVERRIDE');
