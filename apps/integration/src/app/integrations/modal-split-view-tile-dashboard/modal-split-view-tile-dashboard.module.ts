import { NgModule } from '@angular/core';

import { ModalSplitViewTileDashboardRoutingModule } from './modal-split-view-tile-dashboard-routing.module';
import { ModalSplitViewTileDashboardComponent } from './modal-split-view-tile-dashboard.component';

@NgModule({
  declarations: [ModalSplitViewTileDashboardComponent],
  imports: [ModalSplitViewTileDashboardRoutingModule],
})
export class ModalSplitViewTileDashboardModule {
  public static routes = ModalSplitViewTileDashboardRoutingModule.routes;
}
