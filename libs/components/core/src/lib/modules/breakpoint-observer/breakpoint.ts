/**
 * A list of all breakpoints.
 * @internal
 */
export const SKY_BREAKPOINTS = ['xs', 'sm', 'md', 'lg'] as const;

/**
 * The name of a viewport or container breakpoint.
 */
export type SkyBreakpoint = (typeof SKY_BREAKPOINTS)[number];
