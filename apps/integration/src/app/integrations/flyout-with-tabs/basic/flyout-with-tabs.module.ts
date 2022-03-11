import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SkyFlyoutModule } from '@skyux/flyout';

import { FlyoutWithTabsIntegrationComponent } from './flyout-demo.component';
import { FlyoutWithTabsContentIntegrationComponent } from './flyout-with-tabs-content.component';

@NgModule({
  imports: [CommonModule, SkyFlyoutModule],
  declarations: [
    FlyoutWithTabsIntegrationComponent,
    FlyoutWithTabsContentIntegrationComponent,
  ],
  entryComponents: [FlyoutWithTabsContentIntegrationComponent],
  exports: [FlyoutWithTabsIntegrationComponent],
})
export class FlyoutWithTabsIntegrationModule {}
