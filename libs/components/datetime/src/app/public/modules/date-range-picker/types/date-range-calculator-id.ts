/**
 * `SkyDateRangeCalculatorId` values specify calculator objects that return
 * two `Date` objects to represent date ranges. The values populate the options
 * in the date range picker's dropdown. SKY UX uses the `SkyDateRangeService` to create
 * calculators and configures each one with a `validate` function to confirm that dates
 * are compatible. For example, `validate` functions ensure that start dates are before
 * end dates. SKY UX also configures calculators to call a `getValue` function after
 * the `validate` function and return a range of two `Date` objects.
 */
export enum SkyDateRangeCalculatorId {

  /**
   * Selects no dates and considers all dates within the date range. This is the default selection.
   */
  AnyTime,

  /**
   * Enables users to select an end date with no starting date.
   */
  Before,

  /**
   * Enables users to select a start date with no end date.
   */
  After,

  /**
   * Enables users to select specific start and end dates.
   */
  SpecificRange,

  /**
   * Sets the start and end dates to the day before the current day.
   */
  Yesterday,

  /**
   * Sets the start and end dates to the current day.
   */
  Today,

  /**
   * Sets the start and end dates to the day after the current day.
   */
  Tomorrow,

  /**
   * Sets the start date to Sunday of the week before the current week and
   * the end date to Saturday of that week.
   */
  LastWeek,

  /**
   * Sets the start date to Sunday of the current week and the end date to Saturday.
   */
  ThisWeek,

  /**
   * Sets the start date to Sunday of the week after the current week and
   * the end date to Saturday of that week.
   */
  NextWeek,

  /**
   * Sets the start date to the first day of the month before the current month and
   * the end date to the last day of that month.
   */
  LastMonth,

  /**
   * Sets the start date to the first day of the current month and
   * the end date to the last day of the month.
   */
  ThisMonth,

  /**
   * Sets the start date to the first day of the month after the current month
   * and the end date to the last day of that month.
   */
  NextMonth,

  /**
   * Sets the start date to the first day of the quarter before the current quarter and
   * the end date to the last day of that quarter. Quarters are
   * January to March, April to June, July to September, and October to December.
   */
  LastQuarter,

  /**
   * Sets the start date to the first day of the current quarter and
   * the end date to the last day of the quarter. Quarters are
   * January to March, April to June, July to September, and October to December.
   */
  ThisQuarter,

  /**
   * Sets the start date to the first day of the quarter after the current quarter and
   * the end date to the last day of that quarter. Quarters are
   * January to March, April to June, July to September, and October to December.
   */
  NextQuarter,

  /**
   * Sets the start date to the first day of the year before the current year
   * and the end date to the last day of that year.
   */
  LastCalendarYear,

  /**
   * Sets the start date to the first day of the current year and
   * the end date to the last day of the year.
   */
  ThisCalendarYear,

  /**
   * Sets the start date to the first day of the year after the current year and
   * the end date to the last day of that year.
   */
  NextCalendarYear,

  /**
   * Sets the start date to the first day of the fiscal year before the current fiscal year and
   * the end date to the last day of that fiscal year. The fiscal year is Oct. 1 to Sept. 30.
   */
  LastFiscalYear,

  /**
   * Sets the start date to the first day of the current fiscal year and
   * the end date to the last day of the fiscal year. The fiscal year is Oct. 1 to Sept. 30.
   */
  ThisFiscalYear,

  /**
   * Sets the start date to the first day of the fiscal year after the current fiscal year
   * and the end date to the last day of that fiscal year. The fiscal year is Oct. 1 to Sept. 30.
   */
  NextFiscalYear

}
