import { NgModule } from '@angular/core';

import { SkyTilesModule } from '../../tiles.module';

import { TileAsyncTestComponent } from './tile-async.component.fixture';
import { TileDashboardAfterInitTestComponent } from './tile-dashboard-after-init.component.fixture';
import { TileDashboardAsyncTestComponent } from './tile-dashboard-async.component.fixture';
import { TileDashboardOnPushTestComponent } from './tile-dashboard-on-push.component.fixture';
import { TileDashboardTestComponent } from './tile-dashboard.component.fixture';
import { Tile1TestComponent } from './tile1.component.fixture';
import { Tile2TestComponent } from './tile2.component.fixture';

@NgModule({
  declarations: [
    TileAsyncTestComponent,
    Tile1TestComponent,
    Tile2TestComponent,
    TileDashboardAfterInitTestComponent,
    TileDashboardAsyncTestComponent,
    TileDashboardTestComponent,
    TileDashboardOnPushTestComponent,
  ],
  imports: [SkyTilesModule],
})
export class SkyTileDashboardFixturesModule {}
