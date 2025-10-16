import { NgModule } from '@angular/core';

import { SkyViewkeeperDirective } from './viewkeeper.directive';

@NgModule({
  imports: [SkyViewkeeperDirective],
  exports: [SkyViewkeeperDirective],
})
export class SkyViewkeeperModule {}
