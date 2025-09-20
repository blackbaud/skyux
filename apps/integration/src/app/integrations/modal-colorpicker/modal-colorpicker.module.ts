import { NgModule } from '@angular/core';

import { ModalColorpickerRoutingModule } from './modal-colorpicker-routing.module';

@NgModule({
  imports: [ModalColorpickerRoutingModule],
})
export class ModalColorpickerModule {
  public static routes = ModalColorpickerRoutingModule.routes;
}
