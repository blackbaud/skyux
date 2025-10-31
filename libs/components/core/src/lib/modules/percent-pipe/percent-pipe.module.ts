import { NgModule } from '@angular/core';

import { SkyCoreResourcesModule } from '../shared/sky-core-resources.module';

import { SkyPercentPipe } from './percent.pipe';

@NgModule({
  imports: [SkyCoreResourcesModule, SkyPercentPipe],
  exports: [SkyPercentPipe],
})
export class SkyPercentPipeModule {}
