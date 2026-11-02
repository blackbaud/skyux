import { NgModule } from '@angular/core';
import { SkyCodeComponent } from '@skyux/code';
import { SkyWaitModule } from '@skyux/indicators';

import { WaitRoutingModule } from './wait-routing.module';
import { WaitComponent } from './wait.component';

@NgModule({
  declarations: [WaitComponent],
  imports: [WaitRoutingModule, SkyCodeComponent, SkyWaitModule],
})
export class WaitModule {
  public static routes = WaitRoutingModule.routes;
}
