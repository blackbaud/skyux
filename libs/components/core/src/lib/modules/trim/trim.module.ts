import { NgModule } from '@angular/core';

import { SkyTrimDirective } from './trim.directive';

@NgModule({
  imports: [SkyTrimDirective],
  exports: [SkyTrimDirective],
})
export class SkyTrimModule {}
