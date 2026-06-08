import { NgModule } from '@angular/core';
import { provideNoopSkyAnimations } from '@skyux/core';
import { SkyPopoverModule } from '@skyux/popovers';
import { SkyThemeModule } from '@skyux/theme';

/**
 * @internal
 */
@NgModule({
  exports: [SkyPopoverModule],
  imports: [SkyThemeModule],
  providers: [provideNoopSkyAnimations()],
})
export class SkyPopoverTestingModule {}
