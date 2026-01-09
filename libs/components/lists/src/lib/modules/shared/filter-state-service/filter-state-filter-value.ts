/**
 * Represents a value for a filter item.
 * @typeParam TValue - The type of the filter value. Defaults to `unknown` for backward compatibility.
 */
export interface SkyFilterStateFilterValue<TValue = unknown> {
  /**
   * The real value for the filter.
   */
  value: TValue;
  /**
   * A human-readable string for use with values that can't be displayed to the user.
   */
  displayValue?: string;
}
