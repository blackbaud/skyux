import { NgModule } from '@angular/core';

import { TestRoutingModule } from './test-routing.module';

@NgModule({
  declarations: [],
  imports: [TestRoutingModule],
})
export class TestModule {
  public static routes = TestRoutingModule.routes;
}
