import { Injector, StaticProvider, ViewContainerRef } from '@angular/core';

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

  /**
   * The view container reference where the new component should be appended.
   */
  viewContainerRef?: ViewContainerRef;

  /**
   * Parent injector to use instead of the dynamic component service's injector
   */
  parentInjector?: Injector;
}
