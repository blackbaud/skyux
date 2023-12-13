import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SkyIconModule } from '@skyux/indicators';
import { SkyDropdownModule } from '@skyux/popovers';

import { DropdownRoutingModule } from './dropdown-routing.module';
import { DropdownComponent } from './dropdown.component';

@NgModule({
  imports: [
    CommonModule,
    DropdownRoutingModule,
    SkyDropdownModule,
    SkyIconModule,
    FormsModule,
  ],
  declarations: [DropdownComponent],
})
export class DropdownModule {
  public static routes = DropdownRoutingModule.routes;
}
