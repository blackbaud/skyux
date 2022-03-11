import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SkyFlyoutModule } from '@skyux/flyout';

import { FlyoutWithTabsComponent } from './flyout-demo.component';
import { FlyoutWithTabsContentComponent } from './flyout-with-tabs-content.component';

@NgModule({
  imports: [CommonModule, SkyFlyoutModule],
  declarations: [FlyoutWithTabsComponent, FlyoutWithTabsContentComponent],
  entryComponents: [FlyoutWithTabsContentComponent],
  exports: [FlyoutWithTabsComponent],
})
export class FlyoutWithTabsModule {}
