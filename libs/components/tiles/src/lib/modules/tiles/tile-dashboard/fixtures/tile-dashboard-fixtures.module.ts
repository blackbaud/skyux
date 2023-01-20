import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { SkyTilesModule } from '../../tiles.module';

import { Tile1TestComponent } from './tile1.component.fixture';
import { Tile2TestComponent } from './tile2.component.fixture';
import { TileDashboardAfterInitTestComponent } from './tile-dashboard-after-init.component.fixture';
import { TileDashboardOnPushTestComponent } from './tile-dashboard-on-push.component.fixture';
import { TileDashboardTestComponent } from './tile-dashboard.component.fixture';

@NgModule({
  declarations: [
    Tile1TestComponent,
    Tile2TestComponent,
    TileDashboardAfterInitTestComponent,
    TileDashboardTestComponent,
    TileDashboardOnPushTestComponent,
  ],
  imports: [CommonModule, SkyTilesModule],
})
export class SkyTileDashboardFixturesModule {}
