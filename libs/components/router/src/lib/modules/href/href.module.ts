import { NgModule } from '@angular/core';

import { SkyHrefDirective } from './href.directive';

@NgModule({
  declarations: [SkyHrefDirective],
  exports: [SkyHrefDirective],
})
export class SkyHrefModule {}
