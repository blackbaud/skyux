/**
 * Indicates the types of calculations available for a date range calculator.
 */
export enum SkyDateRangeCalculatorType {

  /**
   * The calculator includes an input for a date after the current date.
   */
  After,

  /**
   * The calculator includes an input for a date before the current date.
   */
  Before,

  /**
   * The calculator includes two inputs for a range of dates.
   */
  Range,

  /**
   * The calculator does not accept any input but calculates a specific range based on the current date.
   */
  Relative

}
