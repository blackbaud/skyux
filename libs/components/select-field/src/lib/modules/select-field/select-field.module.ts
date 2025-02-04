import { NgModule } from '@angular/core';

import { SkySelectFieldComponent } from './select-field.component';

/**
 * @deprecated `SkySelectFieldComponent` is deprecated. Use `SkyLookupComponent` instead.
 */
@NgModule({
  imports: [SkySelectFieldComponent],
  exports: [SkySelectFieldComponent],
})
export class SkySelectFieldModule {}
