/**
 * Configuration to be used by the docking action.
 */
export interface SkyDockItemConfig {

  /**
   * The stack order of the item. The higher the number, the higher
   * the item will be placed in the dock. By default, new items will be placed at
   * the top of the stack.
   */
  stackOrder?: number;

}
