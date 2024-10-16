import { SkyMediaBreakpoints } from '../media-breakpoints';

import { SKY_BREAKPOINT_TYPES, SkyBreakpointType } from './breakpoint-type';

/**
 * Whether the value is of type `SkyBreakpointType`.
 * @internal
 */
export function isSkyBreakpointType(
  value: SkyBreakpointType | SkyMediaBreakpoints | null | undefined,
): value is SkyBreakpointType {
  return (
    value !== null &&
    value !== undefined &&
    SKY_BREAKPOINT_TYPES.includes(value as SkyBreakpointType)
  );
}

/**
 * Transforms a `SkyMediaBreakpoints` value to `SkyBreakpointType`.
 * @internal
 */
export function toSkyBreakpointType(
  breakpoint: SkyMediaBreakpoints,
): SkyBreakpointType {
  const breakpointsMap = new Map<SkyMediaBreakpoints, SkyBreakpointType>([
    [SkyMediaBreakpoints.xs, 'xs'],
    [SkyMediaBreakpoints.sm, 'sm'],
    [SkyMediaBreakpoints.md, 'md'],
    [SkyMediaBreakpoints.lg, 'lg'],
  ]);

  return breakpointsMap.get(breakpoint) as SkyBreakpointType;
}

/**
 * Transforms a `SkyBreakpointType` value to `SkyMediaBreakpoints`.
 * @internal
 */
export function toSkyMediaBreakpoints(
  breakpoint: SkyBreakpointType,
): SkyMediaBreakpoints {
  const breakpointsMap = new Map<SkyBreakpointType, SkyMediaBreakpoints>([
    ['xs', SkyMediaBreakpoints.xs],
    ['sm', SkyMediaBreakpoints.sm],
    ['md', SkyMediaBreakpoints.md],
    ['lg', SkyMediaBreakpoints.lg],
  ]);

  return breakpointsMap.get(breakpoint) as SkyMediaBreakpoints;
}
