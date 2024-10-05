// eslint-disable-next-line @nx/enforce-module-boundaries
import { SkyMediaBreakpoints } from '@skyux/core';

/**
 * Provides methods to interact with media queries in tests.
 */
export abstract class SkyMediaQueryTestingController {
  /**
   * Whether the media query service has subscribers.
   */
  public abstract hasSubscribers(): boolean;

  /**
   * Emits the provided breakpoint to all subscribers.
   */
  public abstract setBreakpoint(breakpoint: SkyMediaBreakpoints): void;
}
