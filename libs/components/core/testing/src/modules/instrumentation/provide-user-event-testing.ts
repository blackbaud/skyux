import { Provider } from '@angular/core';
import { _SkyInstrumentationUserEventService } from '@skyux/core';
import { SkyInstrumentationUserEventTestController } from './user-event-controller';
import { SkyInstrumentationUserEventTestingService } from './user-event-testing-service';

export function provideSkyInstrumentationUserEventTesting(): Provider[] {
  return [
    SkyInstrumentationUserEventTestingService,
    {
      provide: _SkyInstrumentationUserEventService,
      useExisting: SkyInstrumentationUserEventTestingService,
    },
    {
      provide: SkyInstrumentationUserEventTestController,
      useExisting: SkyInstrumentationUserEventTestingService,
    },
  ];
}
