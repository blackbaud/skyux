import { EnvironmentProviders, makeEnvironmentProviders } from '@angular/core';
import { provideSkyInstrumentationListener } from '@skyux/core';
import { SkyInstrumentationTestingController } from './testing-controller';
import { SkyInstrumentationTestingService } from './testing-service';

/**
 * Registers a listener that records the user events emitted during a unit test.
 * Inject `SkyInstrumentationTestingController` to validate them.
 */
export function provideSkyInstrumentationTesting(): EnvironmentProviders {
  return makeEnvironmentProviders([
    provideSkyInstrumentationListener(SkyInstrumentationTestingService),
    {
      provide: SkyInstrumentationTestingController,
      useExisting: SkyInstrumentationTestingService,
    },
  ]);
}
