/**
 * Represents a value for a filter item.
 */
export interface SkyFilterAdapterFilterValue {
  /**
   * The real value for the filter.
   */
  value: unknown;
  /**
   * A human-readable string for use with values that can't be displayed to the user.
   */
  displayValue?: string;
}
