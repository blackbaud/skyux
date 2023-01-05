export interface SkyFuzzyDate {
  /**
   * The day in a fuzzy date, where `1` sets the day
   * to the first day of the specified month.
   */
  day?: number;

  /**
   * The month in a fuzzy date, where `1` sets the month to January.
   */
  month?: number;

  /**
   * The year in a fuzzy date.
   */
  year?: number;
}
