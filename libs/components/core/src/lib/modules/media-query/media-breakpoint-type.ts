import { SkyMediaBreakpoints } from './media-breakpoints';

/**
 * @internal
 */
export const SKY_MEDIA_BREAKPOINT_TYPES = ['xs', 'sm', 'md', 'lg'] as const;

/**
 * The names for all media breakpoints.
 */
export type SkyMediaBreakpointType =
  (typeof SKY_MEDIA_BREAKPOINT_TYPES)[number];

/**
 * Whether the value is of type `SkyMediaBreakpointType`.
 */
export function isSkyMediaBreakpointType(
  value: SkyMediaBreakpointType | SkyMediaBreakpoints | null | undefined,
): value is SkyMediaBreakpointType {
  return (
    value !== null &&
    value !== undefined &&
    SKY_MEDIA_BREAKPOINT_TYPES.includes(value as SkyMediaBreakpointType)
  );
}

/**
 * Transforms a `SkyMediaBreakpoints` value to `SkyMediaBreakpointType`.
 * @internal
 */
export function toSkyMediaBreakpointType(
  breakpoint: SkyMediaBreakpoints,
): SkyMediaBreakpointType {
  const breakpointsMap = new Map<SkyMediaBreakpoints, SkyMediaBreakpointType>([
    [SkyMediaBreakpoints.xs, 'xs'],
    [SkyMediaBreakpoints.sm, 'sm'],
    [SkyMediaBreakpoints.md, 'md'],
    [SkyMediaBreakpoints.lg, 'lg'],
  ]);

  return breakpointsMap.get(breakpoint) as SkyMediaBreakpointType;
}

/**
 * Transforms a `SkyMediaBreakpointType` value to `SkyMediaBreakpoints`.
 * @internal
 * @deprecated
 */
export function toSkyMediaBreakpoints(
  breakpoint: SkyMediaBreakpointType,
): SkyMediaBreakpoints {
  const breakpointsMap = new Map<SkyMediaBreakpointType, SkyMediaBreakpoints>([
    ['xs', SkyMediaBreakpoints.xs],
    ['sm', SkyMediaBreakpoints.sm],
    ['md', SkyMediaBreakpoints.md],
    ['lg', SkyMediaBreakpoints.lg],
  ]);

  return breakpointsMap.get(breakpoint) as SkyMediaBreakpoints;
}
