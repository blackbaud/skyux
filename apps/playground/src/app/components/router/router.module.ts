import { NgModule } from '@angular/core';

import { RouterRoutingModule } from './router-routing.module';

@NgModule({
  imports: [RouterRoutingModule],
})
export class RouterModule {
  public static routes = RouterRoutingModule.routes;
}
