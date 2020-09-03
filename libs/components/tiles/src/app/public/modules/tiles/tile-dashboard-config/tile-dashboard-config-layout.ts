import { SkyTileDashboardConfigLayoutColumn } from './tile-dashboard-config-layout-column';

export interface SkyTileDashboardConfigLayout {
  /**
   * A `SkyTileDashboardConfigLayoutColumn` object that describes how to
   * display tiles in a single column on small screens.
   */
  singleColumn: SkyTileDashboardConfigLayoutColumn;
  /**
   * An array of `SkyTileDashboardConfigLayoutColumn` objects that describes
   * how to display tiles in multiple columns on larger screens.
   */
  multiColumn: SkyTileDashboardConfigLayoutColumn[];
}
