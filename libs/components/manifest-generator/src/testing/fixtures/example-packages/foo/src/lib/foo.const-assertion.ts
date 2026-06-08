/**
 * A list of all breakpoints.
 * @internal
 */
export const FOO_BREAKPOINTS = ['xs', 'sm', 'md', 'lg'] as const;

/**
 * The name of a viewport or container breakpoint.
 */
export type FooBreakpoint = (typeof FOO_BREAKPOINTS)[number];

/**
 * A regular array (not const assertion).
 */
export const FOO_REGULAR_ARRAY = ['a', 'b', 'c'];

/**
 * Type from a non-const array - should not use special formatting.
 */
export type FooRegularArrayType = (typeof FOO_REGULAR_ARRAY)[number];
