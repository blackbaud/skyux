import { NgModule } from '@angular/core';

import { SkyPercentPipe } from './percent.pipe';

@NgModule({
  imports: [SkyPercentPipe],
  exports: [SkyPercentPipe],
})
export class SkyPercentPipeModule {}
