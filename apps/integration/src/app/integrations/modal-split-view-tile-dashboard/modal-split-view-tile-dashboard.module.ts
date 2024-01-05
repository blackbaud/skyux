import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ModalSplitViewTileDashboardRoutingModule } from './modal-split-view-tile-dashboard-routing.module';
import { ModalSplitViewTileDashboardComponent } from './modal-split-view-tile-dashboard.component';

@NgModule({
  declarations: [ModalSplitViewTileDashboardComponent],
  imports: [CommonModule, ModalSplitViewTileDashboardRoutingModule],
})
export class ModalSplitViewTileDashboardModule {
  public static routes = ModalSplitViewTileDashboardRoutingModule.routes;
}
