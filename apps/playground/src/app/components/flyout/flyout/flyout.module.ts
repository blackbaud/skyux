import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { DataManagerFlyoutComponent } from './data-manager/data-manager-flyout.component';
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
  imports: [DataManagerFlyoutComponent, FlyoutRoutingModule, RouterModule],
})
export class FlyoutModule {
  public static routes = FlyoutRoutingModule.routes;
}
