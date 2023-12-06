import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ModalColorpickerRoutingModule } from './modal-colorpicker-routing.module';
import { ModalColorpickerComponent } from './modal-colorpicker.component';

@NgModule({
  declarations: [ModalColorpickerComponent],
  imports: [CommonModule, ModalColorpickerRoutingModule],
})
export class ModalColorpickerModule {
  public static routes = ModalColorpickerRoutingModule.routes;
}
