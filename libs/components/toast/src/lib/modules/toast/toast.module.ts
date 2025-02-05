import { NgModule } from '@angular/core';

import { SkyToastComponent } from './toast.component';

/**
 * @deprecated The `SkyToastModule` is no longer needed and can be removed from your application.
 * @internal
 */
@NgModule({
  imports: [SkyToastComponent],
  exports: [SkyToastComponent],
})
export class SkyToastModule {}
