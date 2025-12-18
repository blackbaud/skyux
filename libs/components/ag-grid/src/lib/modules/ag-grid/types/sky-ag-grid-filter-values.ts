/**
 * Filter value for number range filters.
 */
export interface SkyAgGridNumberRangeFilterValue {
  /**
   * The minimum value of the range.
   */
  from: number;
  /**
   * The maximum value of the range.
   */
  to: number;
}

/**
 * Filter value for date range filters.
 */
export interface SkyAgGridDateRangeFilterValue {
  /**
   * The start date of the range.
   */
  from: Date | string;
  /**
   * The end date of the range.
   */
  to: Date | string;
}
