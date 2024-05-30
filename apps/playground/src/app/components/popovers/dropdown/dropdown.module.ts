import { NgModule } from '@angular/core';

import { DropdownRoutingModule } from './dropdown-routing.module';
import { DropdownComponent } from './dropdown.component';

@NgModule({
  imports: [DropdownComponent, DropdownRoutingModule],
})
export class DropdownModule {
  public static routes = DropdownRoutingModule.routes;
}
