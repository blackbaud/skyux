import { NgModule } from '@angular/core';

import { PopoversRoutingModule } from './popovers-routing.module';
import { PopoversComponent } from './popovers.component';

@NgModule({
  imports: [PopoversRoutingModule, PopoversComponent],
})
export class PopoversModule {
  public static routes = PopoversRoutingModule.routes;
}
