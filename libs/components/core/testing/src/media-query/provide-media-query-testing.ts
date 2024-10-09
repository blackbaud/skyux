/* eslint-disable @nx/enforce-module-boundaries */
import { Provider } from '@angular/core';
import {
  SKY_MEDIA_QUERY_SERVICE_OVERRIDE,
  SkyMediaQueryService,
} from '@skyux/core';

import { SkyMediaQueryTestingController } from './media-query-testing.controller';
import { SkyMediaQueryTestingService } from './media-query-testing.service';

/**
 * Mocks the media query service for unit tests.
 */
export function provideSkyMediaQueryTesting(): Provider[] {
  return [
    {
      provide: SKY_MEDIA_QUERY_SERVICE_OVERRIDE,
      useExisting: SkyMediaQueryTestingService,
    },
    {
      provide: SkyMediaQueryService,
      useExisting: SkyMediaQueryTestingService,
    },
    {
      provide: SkyMediaQueryTestingController,
      useExisting: SkyMediaQueryTestingService,
    },
  ];
}
