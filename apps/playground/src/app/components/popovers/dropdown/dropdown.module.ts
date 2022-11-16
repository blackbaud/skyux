import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SkyDropdownModule } from '@skyux/popovers';

import { DropdownRoutingModule } from './dropdown-routing.module';
import { DropdownComponent } from './dropdown.component';

@NgModule({
  imports: [CommonModule, DropdownRoutingModule, SkyDropdownModule],
  declarations: [DropdownComponent],
})
export class DropdownModule {
  public static routes = DropdownRoutingModule.routes;
}
