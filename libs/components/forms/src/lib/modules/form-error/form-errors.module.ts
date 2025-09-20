import { NgModule } from '@angular/core';

import { SkyFormErrorComponent } from './form-error.component';
import { SkyFormErrorsComponent } from './form-errors.component';

/**
 * @internal
 */
@NgModule({
  imports: [SkyFormErrorsComponent, SkyFormErrorComponent],
  exports: [SkyFormErrorsComponent],
})
export class SkyFormErrorsModule {}
