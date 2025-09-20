import { NgModule } from '@angular/core';
import { SkyAlertModule } from '@skyux/indicators';

import { AlertRoutingModule } from './alert-routing.module';
import { AlertDemoComponent } from './alert.component';

@NgModule({
  declarations: [AlertDemoComponent],
  imports: [AlertRoutingModule, SkyAlertModule],
})
export class AlertModule {
  public static routes = AlertRoutingModule.routes;
}
