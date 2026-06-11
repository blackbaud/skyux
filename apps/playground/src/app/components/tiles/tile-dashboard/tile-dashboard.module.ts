import { NgModule } from '@angular/core';
import { SkyTilesModule } from '@skyux/tiles';

import { GREETING_CONFIG, GreetingService } from './greeting/greeting.service';
import { TileDashboardRoutingModule } from './tile-dashboard-routing.module';
import { TileDashboardComponent } from './tile-dashboard.component';
import { Tile1Component } from './tile1.component';

@NgModule({
  imports: [TileDashboardRoutingModule, SkyTilesModule],
  declarations: [Tile1Component, TileDashboardComponent],
  providers: [
    {
      provide: GREETING_CONFIG,
      useValue: { greeting: 'TilesDemoModule' },
    },
    GreetingService,
  ],
})
export class TileDashboardModule {
  public static routes = TileDashboardRoutingModule.routes;
}
