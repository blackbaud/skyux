import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { DataManagerFlyoutModule } from './data-manager/data-manager-flyout.module';
import { FlyoutResponsiveDemoContentComponent } from './flyout-responsive-demo-content.component';
import { FlyoutResponsiveDemoComponent } from './flyout-responsive-demo.component';
import { FlyoutRoutingModule } from './flyout-routing.module';
import { FlyoutComponent } from './flyout.component';

@NgModule({
  declarations: [
    FlyoutComponent,
    FlyoutResponsiveDemoComponent,
    FlyoutResponsiveDemoContentComponent,
  ],
  imports: [DataManagerFlyoutModule, FlyoutRoutingModule, RouterModule],
})
export class FlyoutModule {
  public static routes = FlyoutRoutingModule.routes;
}
