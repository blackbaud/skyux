import { NgModule } from '@angular/core';

import { SkyAutonumericDirective } from './autonumeric.directive';

@NgModule({
  imports: [SkyAutonumericDirective],
  exports: [SkyAutonumericDirective],
})
export class SkyAutonumericModule {}
