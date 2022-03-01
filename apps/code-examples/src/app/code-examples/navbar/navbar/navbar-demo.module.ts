import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SkyNavbarModule } from '@skyux/navbar';
import { SkyDropdownModule } from '@skyux/popovers';

import { NavbarDemoComponent } from './navbar-demo.component';

@NgModule({
  imports: [CommonModule, SkyDropdownModule, SkyNavbarModule],
  declarations: [NavbarDemoComponent],
  exports: [NavbarDemoComponent],
})
export class NavbarDemoModule {}
