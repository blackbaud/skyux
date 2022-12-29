export interface SkyTileDashboardConfigTile {
  /**
   * Specifies the ID of the tile.
   */
  id: string;
  /**
   * Specifies the class type of the tile component.
   */
  componentType: any;
  /**
   * Specifies an array of data providers that can be passed to the tile.
   */
  providers?: any[];
}
