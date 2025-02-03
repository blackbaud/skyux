import { NgModule } from '@angular/core';

import { SkyIdDirective } from './id.directive';

/**
 * @docsIncludeIds SkyIdDirective, SkyIdService
 */
@NgModule({
  declarations: [SkyIdDirective],
  exports: [SkyIdDirective],
})
export class SkyIdModule {}
