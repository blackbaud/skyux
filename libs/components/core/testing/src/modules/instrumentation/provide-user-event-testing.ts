import { EnvironmentProviders, makeEnvironmentProviders } from '@angular/core';
import { provideSkyInstrumentationUserEventListener } from '@skyux/core';
import { SkyInstrumentationUserEventTestingController } from './user-event-controller';
import { SkyInstrumentationUserEventTestingService } from './user-event-testing-service';

/**
 * Registers a listener that records the user events emitted during a unit test.
 * Inject `SkyInstrumentationUserEventTestingController` to validate them.
 */
export function provideSkyInstrumentationUserEventTesting(): EnvironmentProviders {
  return makeEnvironmentProviders([
    provideSkyInstrumentationUserEventListener(
      SkyInstrumentationUserEventTestingService,
    ),
    {
      provide: SkyInstrumentationUserEventTestingController,
      useExisting: SkyInstrumentationUserEventTestingService,
    },
  ]);
}
