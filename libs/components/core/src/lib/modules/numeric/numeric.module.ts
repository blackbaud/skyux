import { NgModule } from '@angular/core';

import { SkyCoreResourcesModule } from '../shared/sky-core-resources.module';

import { SkyNumericPipe } from './numeric.pipe';

@NgModule({
  declarations: [SkyNumericPipe],
  providers: [SkyNumericPipe],
  imports: [SkyCoreResourcesModule],
  exports: [SkyNumericPipe],
})
export class SkyNumericModule {}
