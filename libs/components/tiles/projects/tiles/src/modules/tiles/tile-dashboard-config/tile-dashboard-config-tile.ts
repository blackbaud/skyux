export interface SkyTileDashboardConfigTile {
  /**
   * Specifies the ID of the tile.
   */
  id: string;
  /**
   * Specifies the class type of the tile component. Since you generate the
   * component dynamically instead of with HTML selectors, you must register
   * it with the entryComponents property in the app-extras.module.ts file.
   * For more information, see the
   * [entry components tutorial](https://developer.blackbaud.com/skyux/learn/get-started/advanced/entry-components).
   */
  componentType: any;
  /**
   * Specifies an array of data providers that can be passed to the tile.
   */
  providers?: any[];
}
