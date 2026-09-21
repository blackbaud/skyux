import { EnvironmentProviders, makeEnvironmentProviders } from '@angular/core';
import { provideSkyInstrumentationUserEventListener } from '@skyux/core';
import { SkyInstrumentationUserEventTestController } from './user-event-controller';
import { SkyInstrumentationUserEventTestingService } from './user-event-testing-service';

export function provideSkyInstrumentationUserEventTesting(): EnvironmentProviders {
  return makeEnvironmentProviders([
    provideSkyInstrumentationUserEventListener(
      SkyInstrumentationUserEventTestingService,
    ),
    {
      provide: SkyInstrumentationUserEventTestController,
      useExisting: SkyInstrumentationUserEventTestingService,
    },
  ]);
}
