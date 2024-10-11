// eslint-disable-next-line @nx/enforce-module-boundaries
import { SkyMediaBreakpointType, SkyMediaBreakpoints } from '@skyux/core';

/**
 * Provides methods to interact with media queries in tests.
 */
export abstract class SkyMediaQueryTestingController {
  /**
   * Throws an error if the current breakpoint does not match the expected breakpoint.
   */
  public abstract expectBreakpoint(
    breakpoint: SkyMediaBreakpointType | SkyMediaBreakpoints,
  ): Promise<boolean>;

  /**
   * Emits the provided breakpoint to all subscribers.
   */
  public abstract setBreakpoint(breakpoint: SkyMediaBreakpoints): void;
}
