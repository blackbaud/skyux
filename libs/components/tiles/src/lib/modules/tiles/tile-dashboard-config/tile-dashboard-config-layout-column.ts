import { SkyTileDashboardConfigLayoutTile } from './tile-dashboard-config-layout-tile';

export interface SkyTileDashboardConfigLayoutColumn {
  /**
   * An array of `SkyTileDashboardConfigTile` objects that specifies the
   * tiles to include in the dashboard.
   */
  tiles: SkyTileDashboardConfigLayoutTile[];
}
