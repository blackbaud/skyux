import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SkyNavbarModule } from '@skyux/navbar';
import { SkyDropdownModule } from '@skyux/popovers';

import { NavbarComponent } from './navbar.component';

const routes: Routes = [{ path: '', component: NavbarComponent }];
@NgModule({
  declarations: [NavbarComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SkyNavbarModule,
    SkyDropdownModule,
  ],
  exports: [NavbarComponent],
})
export class NavbarModule {}
