import { SkyMediaBreakpoints } from './media-breakpoints';

/**
 * Specifies a funciton that is called when the breakpoints change. It is called
 * with a `SkyMediaBreakpoints` argument, which is an enum that represents the new breakpoint.
 */
export type SkyMediaQueryListener = (args: SkyMediaBreakpoints) => void;
