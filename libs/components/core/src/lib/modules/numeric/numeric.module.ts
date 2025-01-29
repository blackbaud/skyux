import { NgModule } from '@angular/core';

import { SkyCoreResourcesModule } from '../shared/sky-core-resources.module';

import { SkyNumericPipe } from './numeric.pipe';

/**
 * @docsIncludeIds SkyNumericPipe, SkyNumericService, SkyNumericOptions
 */
@NgModule({
  declarations: [SkyNumericPipe],
  providers: [SkyNumericPipe],
  imports: [SkyCoreResourcesModule],
  exports: [SkyNumericPipe],
})
export class SkyNumericModule {}
