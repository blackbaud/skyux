//#region imports

import {
  SkyDynamicComponentLocation
} from './dynamic-component-location';

//#endregion

/**
 * Options for adding a dynamic component to the page.
 */
export interface SkyDynamicComponentOptions {

  /**
   * The location on the page where the dynamic component should be rendered.
   */
  location?: SkyDynamicComponentLocation;

}
