import { NgModule } from '@angular/core';

import { ReadonlyGridRoutingModule } from './readonly-grid-routing.module';

@NgModule({
  declarations: [],
  imports: [ReadonlyGridRoutingModule],
})
export class ReadonlyGridModule {
  public static routes = ReadonlyGridRoutingModule.routes;
}
