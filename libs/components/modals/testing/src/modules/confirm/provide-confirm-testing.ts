import { Provider } from '@angular/core';
import { SkyConfirmService } from '@skyux/modals';

import { SkyConfirmTestingController } from './confirm-testing.controller';
import { SkyConfirmTestingService } from './confirm-testing.service';

/**
 * @internal
 */
export function provideConfirmTesting(): Provider[] {
  return [
    SkyConfirmTestingService,
    {
      provide: SkyConfirmService,
      useExisting: SkyConfirmTestingService,
    },
    {
      provide: SkyConfirmTestingController,
      useExisting: SkyConfirmTestingService,
    },
  ];
}
