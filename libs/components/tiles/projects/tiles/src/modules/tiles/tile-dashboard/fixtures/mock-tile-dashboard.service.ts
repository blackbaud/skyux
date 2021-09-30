import { EventEmitter, QueryList } from '@angular/core';

import { SkyTileDashboardConfig } from '../../tile-dashboard-config/tile-dashboard-config';
import { SkyTileDashboardConfigTile } from '../../tile-dashboard-config/tile-dashboard-config-tile';
import { Tile1TestComponent } from './tile1.component.fixture';
import { Tile2TestComponent } from './tile2.component.fixture';
import { SkyTileDashboardColumnComponent } from '../../tile-dashboard-column/tile-dashboard-column.component';

export class MockTileDashboardService {
  public bagId = 'id-1';

  public ready = new EventEmitter<SkyTileDashboardConfig>();

  public config: SkyTileDashboardConfig;

  public configChange = new EventEmitter<SkyTileDashboardConfig>();

  public init(
    config: SkyTileDashboardConfig,
    columns?: QueryList<SkyTileDashboardColumnComponent>,
    singleColumn?: SkyTileDashboardColumnComponent,
    settingsKey?: string
  ) {
    this.config = config;
  }

  public getTileComponentType(tile: SkyTileDashboardConfigTile): any {
    switch (tile.id) {
    case 'tile-1':
      return Tile1TestComponent;
    case 'tile-2':
      return Tile2TestComponent;
    default:
      return undefined;
    }
  }

  public addTileComponent() { }

  public tileIsCollapsed() { }

  public setColumns() { }

  public destroy() { }
}
