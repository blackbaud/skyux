import { NgModule } from '@angular/core';

import { provideModalTesting } from './provide-modal-testing';

/**
 * Configures the `SkyModalTestingController` as the implementation for the `SkyModalService`.
 */
@NgModule({
  providers: [provideModalTesting()],
})
export class SkyModalTestingModule {}
