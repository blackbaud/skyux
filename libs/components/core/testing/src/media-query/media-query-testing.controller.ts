// eslint-disable-next-line @nx/enforce-module-boundaries
import { SkyMediaBreakpoints } from '@skyux/core';

export abstract class SkyMediaQueryTestingController {
  public abstract setBreakpoint(breakpoint: SkyMediaBreakpoints): void;
}
