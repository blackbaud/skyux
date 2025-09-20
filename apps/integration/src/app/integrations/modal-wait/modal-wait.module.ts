import { NgModule } from '@angular/core';
import { SkyWaitModule } from '@skyux/indicators';

import { ModalWaitRoutingModule } from './modal-wait-routing-module';
import { ModalWaitComponent } from './modal-wait.component';

@NgModule({
  declarations: [ModalWaitComponent],
  imports: [SkyWaitModule, ModalWaitRoutingModule],
})
export class ModalWaitModule {
  public static routes = ModalWaitRoutingModule.routes;
}
