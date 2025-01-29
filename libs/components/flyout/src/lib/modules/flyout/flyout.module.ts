import { NgModule } from '@angular/core';

import { SkyFlyoutComponent } from './flyout.component';

/**
 * @docsIncludeIds SkyFlyoutService, SkyFlyoutConfig, SkyFlyoutInstance, SkyFlyoutAction, SkyFlyoutBeforeCloseHandler, SkyFlyoutCloseArgs, SkyFlyoutPermalink
 */
@NgModule({
  imports: [SkyFlyoutComponent],
  exports: [SkyFlyoutComponent],
})
export class SkyFlyoutModule {}
