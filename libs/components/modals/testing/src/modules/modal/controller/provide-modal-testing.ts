import { Provider } from '@angular/core';
import { SkyModalService } from '@skyux/modals';

import { SkyModalTestingController } from './modal-testing.controller';
import { SkyModalTestingService } from './modal-testing.service';

/**
 * @internal
 */
export function provideModalTesting(): Provider[] {
  return [
    SkyModalTestingService,
    {
      provide: SkyModalService,
      useExisting: SkyModalTestingService,
    },
    {
      provide: SkyModalTestingController,
      useExisting: SkyModalTestingService,
    },
  ];
}
