export interface SkyTileDashboardConfigReorderData {
  /**
   * Specifies the description of the tile.
   */
  tileDescription: string;
  /**
   * Specifies the column for the tile.
   */
  column: number | undefined;
  /**
   * Specifies the position of the tile within the column.
   */
  position: number;
}
