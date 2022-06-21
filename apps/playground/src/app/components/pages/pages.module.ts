import { NgModule } from '@angular/core';

import { PagesRoutingModule } from './pages-routing.module';

@NgModule({
  imports: [PagesRoutingModule],
})
export class PagesModule {
  public static routes = PagesRoutingModule.routes;
}
