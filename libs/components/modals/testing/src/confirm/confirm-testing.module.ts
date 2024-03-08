import { NgModule } from '@angular/core';

import { provideConfirmTesting } from './provider';

/**
 * Configures the `SkyConfirmTestingController` as the backend for the `SkyConfirmService`.
 */
@NgModule({
  providers: [provideConfirmTesting()],
})
export class SkyConfirmTestingModule {}
