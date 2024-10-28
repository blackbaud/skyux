import { SkyMediaBreakpoints } from '../media-query/media-breakpoints';

import { SKY_BREAKPOINTS, SkyBreakpoint } from './breakpoint';

const breakpointLookup = new Map<SkyMediaBreakpoints, SkyBreakpoint>([
  [SkyMediaBreakpoints.xs, 'xs'],
  [SkyMediaBreakpoints.sm, 'sm'],
  [SkyMediaBreakpoints.md, 'md'],
  [SkyMediaBreakpoints.lg, 'lg'],
]);

const legacyLookup = new Map<SkyBreakpoint, SkyMediaBreakpoints>([
  ['xs', SkyMediaBreakpoints.xs],
  ['sm', SkyMediaBreakpoints.sm],
  ['md', SkyMediaBreakpoints.md],
  ['lg', SkyMediaBreakpoints.lg],
]);

/**
 * Whether the value is of type `SkyBreakpoint`.
 * @internal
 */
export function isSkyBreakpoint(
  value: SkyBreakpoint | SkyMediaBreakpoints | null | undefined,
): value is SkyBreakpoint {
  return (
    value !== null &&
    value !== undefined &&
    SKY_BREAKPOINTS.includes(value as SkyBreakpoint)
  );
}

/**
 * Transforms a `SkyMediaBreakpoints` value to `SkyBreakpoint`.
 * @internal
 */
export function toSkyBreakpoint(
  breakpoint: SkyMediaBreakpoints,
): SkyBreakpoint {
  return breakpointLookup.get(breakpoint) as SkyBreakpoint;
}

/**
 * Transforms a `SkyBreakpoint` value to `SkyMediaBreakpoints`.
 * @internal
 */
export function toSkyMediaBreakpoints(
  breakpoint: SkyBreakpoint,
): SkyMediaBreakpoints {
  return legacyLookup.get(breakpoint) as SkyMediaBreakpoints;
}
