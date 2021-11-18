import { EventEmitter } from '@angular/core';

import { SkyTileComponent } from '../tile.component';

import { SkyTileDashboardConfig } from '../../tile-dashboard-config/tile-dashboard-config';

export class MockSkyTileDashboardService {
  public configChange = new EventEmitter<SkyTileDashboardConfig>();

  public setTileCollapsed(tile: SkyTileComponent, isCollapsed: boolean) {}

  public tileIsCollapsed() {}
}
