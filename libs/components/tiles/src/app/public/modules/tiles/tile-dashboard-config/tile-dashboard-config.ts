import {
  SkyTileDashboardConfigLayout
} from './tile-dashboard-config-layout';
import {
  SkyTileDashboardConfigTile
} from './tile-dashboard-config-tile';
import {
  SkyTileDashboardConfigReorderData
} from './tile-dashboard-config-reorder-data';

export interface SkyTileDashboardConfig {
  tiles: SkyTileDashboardConfigTile[];
  layout: SkyTileDashboardConfigLayout;
  movedTile?: SkyTileDashboardConfigReorderData;
}
