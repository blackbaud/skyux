import {
  SkyDynamicComponentLocation
} from './dynamic-component-location';

/**
 * Options for adding a dynamic component to the page.
 */
export interface SkyDynamicComponentArgs {

  /**
   * The type of the component to dynamically create.
   */
  componentType: any;

  /**
   * The location on the page where the dynamic component should be rendered.
   */
  location: SkyDynamicComponentLocation;

}
