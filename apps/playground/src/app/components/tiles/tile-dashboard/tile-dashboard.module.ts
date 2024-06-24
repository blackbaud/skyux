import { NgModule } from '@angular/core';
import { SkyHelpInlineModule } from '@skyux/help-inline';
import { SkyTilesModule } from '@skyux/tiles';

import { GreetingService } from './greeting/greeting.service';
import { Tile1Component } from './tile1.component';
import { Tile2Component } from './tile2.component';
import { TileDashboardRoutingModule } from './tile-dashboard-routing.module';
import { TileDashboardComponent } from './tile-dashboard.component';

@NgModule({
  imports: [TileDashboardRoutingModule, SkyHelpInlineModule, SkyTilesModule],
  declarations: [Tile1Component, Tile2Component, TileDashboardComponent],
  providers: [
    {
      provide: GreetingService,
      useValue: new GreetingService({ greeting: 'TilesDemoModule' }),
    },
  ],
})
export class TileDashboardModule {
  public static routes = TileDashboardRoutingModule.routes;
}
