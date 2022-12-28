export interface SkyTileDashboardConfigTile {
  /**
   * The ID of the tile.
   */
  id: string;
  /**
   * The class type of the tile component.
   */
  componentType: any;
  /**
   * An array of data providers that can be passed to the tile.
   */
  providers?: any[];
}
