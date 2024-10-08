/* eslint-disable @nx/enforce-module-boundaries */
import { Provider } from '@angular/core';
import { SkyMediaQueryService } from '@skyux/core';

import { SkyMediaQueryTestingController } from './media-query-testing.controller';
import { SkyMediaQueryTestingService } from './media-query-testing.service';

/**
 * Mocks the media query service for unit tests.
 */
export function provideSkyMediaQueryTesting(): Provider[] {
  return [
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
