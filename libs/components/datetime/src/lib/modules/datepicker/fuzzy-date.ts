export interface SkyFuzzyDate {
  /**
   * Specifies the day in a fuzzy date, where `1` sets the day
   * to the first day of the specified month.
   */
  day?: number;

  /**
   * Specifies the month in a fuzzy date, where `1` sets the month to January.
   */
  month?: number;

  /**
   * Specifies the year in a fuzzy date.
   */
  year?: number;
}
