import { NgModule } from '@angular/core';

import { NavbarRoutingModule } from './navbar-routing.module';
import { NavbarComponent } from './navbar.component';

@NgModule({
  imports: [NavbarRoutingModule, NavbarComponent],
})
export class NavbarModule {
  public static routes = NavbarRoutingModule.routes;
}
