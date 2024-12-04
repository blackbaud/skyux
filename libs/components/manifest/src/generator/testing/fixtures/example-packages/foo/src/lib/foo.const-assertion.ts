/**
 * A list of all breakpoints.
 * @internal
 */
export const FOO_BREAKPOINTS = ['xs', 'sm', 'md', 'lg'] as const;

/**
 * The name of a viewport or container breakpoint.
 */
export type FooBreakpoint = (typeof FOO_BREAKPOINTS)[number];
