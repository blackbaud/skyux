import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SkyFlyoutModule } from '@skyux/flyout';
import { SkyTabsModule } from '@skyux/tabs';

import { FlyoutTabsContentComponent } from './flyout-tabs-content.component';
import { FlyoutTabsComponent } from './flyout-tabs.component';

@NgModule({
  imports: [CommonModule, SkyFlyoutModule, SkyTabsModule],
  declarations: [FlyoutTabsComponent, FlyoutTabsContentComponent],
  entryComponents: [FlyoutTabsContentComponent],
  exports: [FlyoutTabsComponent],
})
export class FlyoutTabsModule {}
