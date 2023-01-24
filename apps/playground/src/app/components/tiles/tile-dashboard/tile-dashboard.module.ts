import { NgModule } from '@angular/core';
import { SkyTilesModule } from '@skyux/tiles';

import { Tile1Component } from './tile1.component';
import { TileDashboardRoutingModule } from './tile-dashboard-routing.module';
import { TileDashboardComponent } from './tile-dashboard.component';

@NgModule({
  imports: [TileDashboardRoutingModule, SkyTilesModule],
  declarations: [Tile1Component, TileDashboardComponent],
})
export class TileDashboardModule {
  public static routes = TileDashboardRoutingModule.routes;
}
