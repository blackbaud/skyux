import { NgModule } from '@angular/core';
import { SkyWaitModule } from '@skyux/indicators';

import { WaitRoutingModule } from './wait-routing.module';
import { WaitComponent } from './wait.component';

@NgModule({
  declarations: [WaitComponent],
  imports: [WaitRoutingModule, SkyWaitModule],
})
export class WaitModule {
  public static routes = WaitRoutingModule.routes;
}
