import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SkyWaitModule } from '@skyux/indicators';
import { SkyModalModule } from '@skyux/modals';

import { ModalWaitModalComponent } from './modal-wait-modal.component';
import { ModalWaitRoutingModule } from './modal-wait-routing-module';
import { ModalWaitComponent } from './modal-wait.component';

@NgModule({
  declarations: [ModalWaitComponent, ModalWaitModalComponent],
  imports: [
    CommonModule,
    SkyModalModule,
    SkyWaitModule,
    ModalWaitRoutingModule,
  ],
})
export class ModalWaitModule {
  public static routes = ModalWaitRoutingModule.routes;
}
