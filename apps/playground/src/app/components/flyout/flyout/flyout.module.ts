import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SkyInfiniteScrollModule } from '@skyux/lists';
import { SkyDropdownModule } from '@skyux/popovers';

import { DataManagerFlyoutModule } from './data-manager/data-manager-flyout.module';
import { FlyoutDemoComponent } from './flyout-demo.component';
import { FlyoutResponsiveDemoContentComponent } from './flyout-responsive-demo-content.component';
import { FlyoutResponsiveDemoComponent } from './flyout-responsive-demo.component';
import { FlyoutRoutingModule } from './flyout-routing.module';
import { FlyoutComponent } from './flyout.component';

@NgModule({
  declarations: [
    FlyoutComponent,
    FlyoutDemoComponent,
    FlyoutResponsiveDemoComponent,
    FlyoutResponsiveDemoContentComponent,
  ],
  imports: [
    CommonModule,
    DataManagerFlyoutModule,
    FlyoutRoutingModule,
    SkyDropdownModule,
    SkyInfiniteScrollModule,
    RouterModule,
  ],
})
export class FlyoutModule {
  public static routes = FlyoutRoutingModule.routes;
}
