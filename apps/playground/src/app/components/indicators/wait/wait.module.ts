import { NgModule } from '@angular/core';
import { SkyCode } from '@skyux/code';
import { SkyWaitModule } from '@skyux/indicators';

import { WaitRoutingModule } from './wait-routing.module';
import { WaitComponent } from './wait.component';

@NgModule({
  declarations: [WaitComponent],
  imports: [WaitRoutingModule, SkyCode, SkyWaitModule],
})
export class WaitModule {
  public static routes = WaitRoutingModule.routes;
}
