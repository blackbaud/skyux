import { NgModule } from '@angular/core';

import { SkyTrimDirective } from './trim.directive';

@NgModule({
  declarations: [SkyTrimDirective],
  exports: [SkyTrimDirective],
})
export class SkyTrimModule {}
