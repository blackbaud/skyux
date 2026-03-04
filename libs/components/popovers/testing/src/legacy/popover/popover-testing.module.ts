import { NgModule } from '@angular/core';
import { SkyPopoverModule } from '@skyux/popovers';
import { SkyThemeModule, provideNoopSkyAnimations } from '@skyux/theme';

/**
 * @internal
 */
@NgModule({
  exports: [SkyPopoverModule],
  imports: [SkyThemeModule],
  providers: [provideNoopSkyAnimations()],
})
export class SkyPopoverTestingModule {}
