import { NgModule } from '@angular/core';

import { SkyAlert } from './alert.component';

/**
 * @deprecated Import the standalone `SkyAlert` component directly instead of
 * importing this module.
 */
@NgModule({
  imports: [SkyAlert],
  exports: [SkyAlert],
})
export class SkyAlertModule {}
