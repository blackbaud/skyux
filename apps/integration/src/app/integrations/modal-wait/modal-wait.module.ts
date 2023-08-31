import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SkyWaitModule } from '@skyux/indicators';

import { ModalWaitRoutingModule } from './modal-wait-routing-module';
import { ModalWaitComponent } from './modal-wait.component';

@NgModule({
  declarations: [ModalWaitComponent],
  imports: [CommonModule, SkyWaitModule, ModalWaitRoutingModule],
})
export class ModalWaitModule {
  public static routes = ModalWaitRoutingModule.routes;
}
