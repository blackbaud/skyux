import { SkyMediaBreakpoints } from './media-breakpoints';

const SKY_MEDIA_BREAKPOINT_TYPES = ['xs', 'sm', 'md', 'lg'] as const;

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
 * The default media breakpoint type.
 * @internal
 */
export const SKY_MEDIA_BREAKPOINT_TYPE_DEFAULT: SkyMediaBreakpointType = 'md';

/**
 * Transforms a `SkyMediaBreakpoints` value to `SkyMediaBreakpointType`.
 */
export function toSkyMediaBreakpointType(
  breakpoint: SkyMediaBreakpoints,
): SkyMediaBreakpointType | undefined {
  const breakpointsMap = new Map<SkyMediaBreakpoints, SkyMediaBreakpointType>([
    [SkyMediaBreakpoints.xs, 'xs'],
    [SkyMediaBreakpoints.sm, 'sm'],
    [SkyMediaBreakpoints.md, 'md'],
    [SkyMediaBreakpoints.lg, 'lg'],
  ]);

  return breakpointsMap.get(breakpoint);
}
