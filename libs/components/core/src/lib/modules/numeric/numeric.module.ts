import { NgModule } from '@angular/core';

import { SkyCoreResourcesModule } from '../shared/sky-core-resources.module';

import { SkyNumericPipe } from './numeric.pipe';
import { SkyNumericService } from './numeric.service';

@NgModule({
  declarations: [SkyNumericPipe],
  providers: [SkyNumericPipe, SkyNumericService],
  imports: [SkyCoreResourcesModule],
  exports: [SkyNumericPipe],
})
export class SkyNumericModule {}
