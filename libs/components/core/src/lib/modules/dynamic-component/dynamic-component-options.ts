import { StaticProvider } from '@angular/core';

import { SkyDynamicComponentLocation } from './dynamic-component-location';

/**
 * Options for adding a dynamic component to the page.
 */
export interface SkyDynamicComponentOptions {
  /**
   * The location on the page where the dynamic component should be rendered.
   */
  location?: SkyDynamicComponentLocation;

  /**
   * Providers to inject into the new component.
   */
  providers?: StaticProvider[];

  /**
   * The reference element used when using the `ElementTop` or `ElementBottom` locations.
   */
  referenceEl?: HTMLElement;
}
