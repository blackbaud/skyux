import { NgModule } from '@angular/core';

import { SkyContainerQueryDirective } from './container-query.directive';

@NgModule({
  imports: [SkyContainerQueryDirective],
  exports: [SkyContainerQueryDirective],
})
export class SkyContainerQueryModule {}
