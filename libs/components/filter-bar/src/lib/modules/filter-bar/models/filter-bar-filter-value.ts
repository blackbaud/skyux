export interface SkyFilterBarFilterValue {
  /**
   * The raw value of the filter.
   * @required
   */
  value: unknown;
  /**
   * A string representation of the value that is displayed by the filter bar when the filter is set.
   */
  displayValue?: string;
}
