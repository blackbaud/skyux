import {
  SkyDockLocation
} from './dock-location';

/**
 * Options for adding a dock component to the page.
 */
export interface SkyDockOptions {

  /**
   * The location on the page where the dock component should be rendered.
   */
  location?: SkyDockLocation;

  /**
   * The reference element used when using the `BeforeElement` or `ElementBottom` locations.
   */
  referenceEl?: HTMLElement;

  /**
   * The z-index for the dock element
   */
  zIndex?: number;

}
