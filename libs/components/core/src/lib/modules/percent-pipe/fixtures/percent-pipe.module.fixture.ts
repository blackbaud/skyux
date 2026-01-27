import { NgModule } from '@angular/core';

import { SkyPercentPipeModule } from '../percent-pipe.module';

import { PercentPipeTestComponent } from './percent-pipe.component.fixture';

@NgModule({
  exports: [PercentPipeTestComponent],
  imports: [SkyPercentPipeModule, PercentPipeTestComponent],
})
export class PercentPipeTestModule {}
