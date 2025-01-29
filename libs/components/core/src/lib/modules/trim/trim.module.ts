import { NgModule } from '@angular/core';

import { SkyTrimDirective } from './trim.directive';

/**
 * @docsIncludeIds SkyTrimDirective
 */
@NgModule({
  declarations: [SkyTrimDirective],
  exports: [SkyTrimDirective],
})
export class SkyTrimModule {}
