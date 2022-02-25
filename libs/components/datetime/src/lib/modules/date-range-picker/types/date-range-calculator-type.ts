/**
 * Indicates the types of calculations available for a date range calculator.
 */
export enum SkyDateRangeCalculatorType {
  /**
   * Includes an input for a date after the current date.
   */
  After,

  /**
   * Includes an input for a date before the current date.
   */
  Before,

  /**
   * Includes two inputs for a range of dates.
   */
  Range,

  /**
   * Does not accept any input but calculates a specific range based on the current date.
   */
  Relative,
}
