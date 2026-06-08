import { NgModule } from '@angular/core';
import { provideNoopSkyAnimations } from '@skyux/core';
import { SkySearchModule } from '@skyux/lookup';

/**
 * @internal
 */
@NgModule({
  exports: [SkySearchModule],
  providers: [provideNoopSkyAnimations()],
})
export class SkySearchTestingModule {}
