/**
 * @internal
 */
export const SKY_BREAKPOINT_TYPES = ['xs', 'sm', 'md', 'lg'] as const;

/**
 * The name of a breakpoint width (media or container).
 */
export type SkyBreakpointType = (typeof SKY_BREAKPOINT_TYPES)[number];
