import { AsyncPipe, NgIf } from '@angular/common';
import { NgModule } from '@angular/core';

import { ModalViewkeptToolbarsRoutingModule } from './modal-viewkept-toolbars-routing-module';
import { ModalViewkeptToolbarsComponent } from './modal-viewkept-toolbars.component';

@NgModule({
  declarations: [ModalViewkeptToolbarsComponent],
  imports: [ModalViewkeptToolbarsRoutingModule, AsyncPipe, NgIf],
})
export class ModalViewkeptToolbarsModule {
  public static routes = ModalViewkeptToolbarsRoutingModule.routes;
}
