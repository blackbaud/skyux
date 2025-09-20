import { SkyMediaBreakpoints } from './media-breakpoints';

/**
 * The function that is called when the breakpoints change. It is called
 * with a `SkyMediaBreakpoints` argument, which is an enum that represents the new breakpoint.
 * @deprecated Subscribe to the `breakpointChange` observable instead.
 */
export type SkyMediaQueryListener = (args: SkyMediaBreakpoints) => void;
