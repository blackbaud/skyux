import { SkyFilterStateFilterValue } from '@skyux/lists';

/**
 * Represents a value for a filter item.
 * @typeParam TValue - The type of the filter value. Defaults to `unknown` for backward compatibility.
 */
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export type SkyFilterBarFilterValue<TValue = unknown> =
  SkyFilterStateFilterValue<TValue>;
