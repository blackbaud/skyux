import { NgModule } from '@angular/core';

import { SkyToastComponent } from './toast.component';

/**
 * @docsIncludeIds SkyToastService, SkyToastConfig, SkyToastType, SkyToastInstance, SkyToastContainerOptions, SkyToastDisplayDirection
 */
@NgModule({
  imports: [SkyToastComponent],
  exports: [SkyToastComponent],
})
export class SkyToastModule {}
