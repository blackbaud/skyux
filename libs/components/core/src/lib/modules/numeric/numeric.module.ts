import { NgModule } from '@angular/core';

import { SkyCoreResourcesModule } from '../shared/sky-core-resources.module';

import { SkyNumericPipe } from './numeric.pipe';

@NgModule({
  imports: [SkyCoreResourcesModule, SkyNumericPipe],
  providers: [SkyNumericPipe],
  exports: [SkyNumericPipe],
})
export class SkyNumericModule {}
