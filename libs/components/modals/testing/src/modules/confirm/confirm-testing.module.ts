import { NgModule } from '@angular/core';

import { provideConfirmTesting } from './provide-confirm-testing';

/**
 * Configures the `SkyConfirmTestingController` as the backend for the `SkyConfirmService`.
 * @docsIncludeIds SkyConfirmTestingController
 */
@NgModule({
  providers: [provideConfirmTesting()],
})
export class SkyConfirmTestingModule {}
