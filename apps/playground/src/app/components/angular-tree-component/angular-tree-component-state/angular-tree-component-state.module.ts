import { NgModule } from '@angular/core';

import { AngularTreeComponentStateRoutingModule } from './angular-tree-component-state-routing.module';
import { AngularTreeComponentStateComponent } from './angular-tree-component-state.component';

@NgModule({
  declarations: [AngularTreeComponentStateComponent],
  imports: [AngularTreeComponentStateRoutingModule],
})
export class AngularTreeComponentStateModule {
  public static routes = AngularTreeComponentStateRoutingModule.routes;
}
