import { NgModule } from '@angular/core';

import { ModalVisualRoutingModule } from './modal-visual-routing.module';

@NgModule({
  declarations: [],
  imports: [ModalVisualRoutingModule],
})
export class ModalVisualModule {
  public static routes = ModalVisualRoutingModule.routes;
}
