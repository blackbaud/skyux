import { NgModule } from '@angular/core';

import { SkyCoreResourcesModule } from '../shared/sky-core-resources.module';

import { SkyPercentPipe } from './percent.pipe';

@NgModule({
  declarations: [SkyPercentPipe],
  providers: [SkyPercentPipe],
  imports: [SkyCoreResourcesModule],
  exports: [SkyPercentPipe],
})
export class SkyPercentPipeModule {}
