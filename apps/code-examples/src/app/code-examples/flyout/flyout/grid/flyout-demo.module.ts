import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SkyAvatarModule } from '@skyux/avatar';
import { SkyFlyoutModule } from '@skyux/flyout';
import { SkyKeyInfoModule, SkyLabelModule } from '@skyux/indicators';
import { SkyPageSummaryModule } from '@skyux/layout';
import { SkyListModule } from '@skyux/list-builder';
import { SkyListViewGridModule } from '@skyux/list-builder-view-grids';

import { FlyoutDemoFlyoutComponent } from './flyout-demo-flyout.component';
import { FlyoutDemoComponent } from './flyout-demo.component';

@NgModule({
  imports: [
    CommonModule,
    SkyAvatarModule,
    SkyFlyoutModule,
    SkyListModule,
    SkyKeyInfoModule,
    SkyLabelModule,
    SkyListViewGridModule,
    SkyPageSummaryModule,
  ],
  declarations: [FlyoutDemoComponent, FlyoutDemoFlyoutComponent],
  exports: [FlyoutDemoComponent],
})
export class FlyoutDemoModule {}
