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
   * The array of data providers that can be passed to the tile.
   */
  providers?: any[];
}
