import { NgModule } from '@angular/core';

import { CommonModule } from '@angular/common';

import { SkyDropdownModule } from '@skyux/popovers';

import { SkyNavbarModule } from 'projects/navbar/src/public-api';

import { NavbarDemoComponent } from './navbar-demo.component';

@NgModule({
  imports: [CommonModule, SkyDropdownModule, SkyNavbarModule],
  declarations: [NavbarDemoComponent],
  exports: [NavbarDemoComponent],
})
export class NavbarDemoModule {}
