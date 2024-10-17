/**
 * @internal
 */
export const SKY_BREAKPOINTS = ['xs', 'sm', 'md', 'lg'] as const;

/**
 * The name of a breakpoint width (media or container).
 */
export type SkyBreakpoint = (typeof SKY_BREAKPOINTS)[number];
