import { NgModule } from '@angular/core';

import { PageDataManagerSplitViewRoutingModule } from './page-data-manager-split-view-routing.module';

@NgModule({
  imports: [PageDataManagerSplitViewRoutingModule],
})
export class PageDataManagerSplitViewModule {
  public static routes = PageDataManagerSplitViewRoutingModule.routes;
}
