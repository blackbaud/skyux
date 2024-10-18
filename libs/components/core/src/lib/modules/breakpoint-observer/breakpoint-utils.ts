import { SkyMediaBreakpoints } from '../media-query/media-breakpoints';

import { SKY_BREAKPOINTS, SkyBreakpoint } from './breakpoint';

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
  const breakpointsMap = new Map<SkyMediaBreakpoints, SkyBreakpoint>([
    [SkyMediaBreakpoints.xs, 'xs'],
    [SkyMediaBreakpoints.sm, 'sm'],
    [SkyMediaBreakpoints.md, 'md'],
    [SkyMediaBreakpoints.lg, 'lg'],
  ]);

  return breakpointsMap.get(breakpoint) as SkyBreakpoint;
}

/**
 * Transforms a `SkyBreakpoint` value to `SkyMediaBreakpoints`.
 * @internal
 */
export function toSkyMediaBreakpoints(
  breakpoint: SkyBreakpoint,
): SkyMediaBreakpoints {
  const breakpointsMap = new Map<SkyBreakpoint, SkyMediaBreakpoints>([
    ['xs', SkyMediaBreakpoints.xs],
    ['sm', SkyMediaBreakpoints.sm],
    ['md', SkyMediaBreakpoints.md],
    ['lg', SkyMediaBreakpoints.lg],
  ]);

  return breakpointsMap.get(breakpoint) as SkyMediaBreakpoints;
}
