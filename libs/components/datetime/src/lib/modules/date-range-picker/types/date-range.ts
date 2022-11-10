// TODO: In a future breaking change, consider removing the `| null` cases here. This is used today to determine initial changes and as a default value in the `getValue` function of a `SkyDateRangeCalculator`
export interface SkyDateRange {
  /**
   * Specifies the last date in the date range.
   */
  endDate?: Date | null;

  /**
   * Specifies the first date in the date range.
   */
  startDate?: Date | null;
}
