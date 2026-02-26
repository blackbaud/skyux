import { NgModule } from '@angular/core';
import { SkyPopoverModule } from '@skyux/popovers';
import { SkyThemeModule } from '@skyux/theme';

/**
 * @internal
 */
@NgModule({
  exports: [SkyPopoverModule],
  imports: [SkyThemeModule],
})
export class SkyPopoverTestingModule {}
