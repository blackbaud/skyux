import { NgModule } from '@angular/core';

import { ModalFooterDropdownRoutingModule } from './modal-footer-dropdown-routing.module';

@NgModule({
  imports: [ModalFooterDropdownRoutingModule],
})
export class ModalFooterDropdownModule {
  public static routes = ModalFooterDropdownRoutingModule.routes;
}
