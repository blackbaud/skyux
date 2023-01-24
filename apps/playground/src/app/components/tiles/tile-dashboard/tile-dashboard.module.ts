import { NgModule } from '@angular/core';
import { SkyTilesModule } from '@skyux/tiles';

import { Tile1Component } from './tile1.component';
import { TileDashboardComponent } from './tile-dashboard.component';

@NgModule({
  imports: [SkyTilesModule],
  declarations: [Tile1Component, TileDashboardComponent],
})
export class TileDashboardModule {}
