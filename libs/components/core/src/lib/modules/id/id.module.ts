import { NgModule } from '@angular/core';

import { SkyIdDirective } from './id.directive';

@NgModule({
  imports: [SkyIdDirective],
  exports: [SkyIdDirective],
})
export class SkyIdModule {}
