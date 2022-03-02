import { EventEmitter } from '@angular/core';

import { SkyTileDashboardConfig } from '../../tile-dashboard-config/tile-dashboard-config';
import { SkyTileComponent } from '../tile.component';

export class MockSkyTileDashboardService {
  public configChange = new EventEmitter<SkyTileDashboardConfig>();

  public setTileCollapsed(tile: SkyTileComponent, isCollapsed: boolean) {}

  public tileIsCollapsed() {}
}
