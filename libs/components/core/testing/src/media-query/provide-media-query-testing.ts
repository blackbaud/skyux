/* eslint-disable @nx/enforce-module-boundaries */
import { EnvironmentProviders, makeEnvironmentProviders } from '@angular/core';
import { SkyMediaQueryService } from '@skyux/core';

import { SkyMediaQueryTestingController } from './media-query-testing.controller';
import { SkyMediaQueryTestingService } from './media-query-testing.service';

export function provideSkyMediaQueryTesting(): EnvironmentProviders {
  return makeEnvironmentProviders([
    SkyMediaQueryTestingService,
    {
      provide: SkyMediaQueryService,
      useExisting: SkyMediaQueryTestingService,
    },
    {
      provide: SkyMediaQueryTestingController,
      useExisting: SkyMediaQueryTestingService,
    },
  ]);
}
