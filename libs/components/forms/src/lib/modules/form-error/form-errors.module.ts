import { NgModule } from '@angular/core';

import { SkyFormErrorsComponent } from './form-errors.component';
import { SkyFormErrorComponent } from './form-error.component';

/**
 * @internal
 */
@NgModule({
  imports: [SkyFormErrorsComponent, SkyFormErrorComponent],
  exports: [SkyFormErrorsComponent, SkyFormErrorComponent],
})
export class SkyFormErrorsModule {}
