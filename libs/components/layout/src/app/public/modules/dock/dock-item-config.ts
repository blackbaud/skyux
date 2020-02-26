import {
  StaticProvider
} from '@angular/core';

/**
 * Configuration to be used by the docking action.
 * @deprecated Use `SkyDockItemConfig` from `@skyux/core` instead.
 */
export interface SkyDockItemConfig {

  /**
   * Static providers to inject into the item's component.
   */
  providers?: StaticProvider[];

  /**
   * The stack order of the item. The higher the number, the higher
   * the item will be placed in the dock. By default, new items will be placed at
   * the top of the stack.
   */
  stackOrder?: number;

}
