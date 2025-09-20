import { NgModule } from '@angular/core';

import { DataManagerLargeRoutingModule } from './data-manager-large-routes';

@NgModule({
  imports: [DataManagerLargeRoutingModule],
})
export class DataManagerLargeModule {
  public static routes = DataManagerLargeRoutingModule.routes;
}
