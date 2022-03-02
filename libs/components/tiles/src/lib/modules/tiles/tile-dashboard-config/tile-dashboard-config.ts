import { SkyTileDashboardConfigLayout } from './tile-dashboard-config-layout';
import { SkyTileDashboardConfigReorderData } from './tile-dashboard-config-reorder-data';
import { SkyTileDashboardConfigTile } from './tile-dashboard-config-tile';

export interface SkyTileDashboardConfig {
  /**
   * An array of SkyTileDashboardConfigTile objects that specifies the tiles
   * to include in the dashboard.
   * @required
   */
  tiles: SkyTileDashboardConfigTile[];
  /**
   * A `SkyTileDashboardConfigLayout` object that describes the tile dashboard's layout.
   */
  layout: SkyTileDashboardConfigLayout;
  /**
   * A `SkyTileDashboardConfigReorderData` object that describes
   * how to move a tile within the dashboard.
   */
  movedTile?: SkyTileDashboardConfigReorderData;
}
