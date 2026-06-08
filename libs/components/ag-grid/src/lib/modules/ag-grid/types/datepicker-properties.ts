export interface SkyAgGridDatepickerProperties {
  /**
   * The date format for the input.
   * @default "MM/DD/YYYY"
   */
  dateFormat?: string;
  /**
   * Whether to disable the datepicker cell.
   * @default false
   */
  disabled?: boolean;
  /**
   * The latest date that is available in the calendar.
   */
  maxDate?: Date;
  /**
   * The earliest date that is available in the calendar. To avoid validation errors, the time associated with the minimum date is midnight. This is necessary because the datepicker automatically sets the time on the Date object for selected dates to midnight in the current user's time zone.
   */
  minDate?: Date;
  /**
   * Whether to disable date validation on the datepicker input.
   * @default false
   */
  skyDatepickerNoValidate?: boolean;
  /**
   * The starting day of the week in the calendar. `0` sets the starting day to Sunday.
   * @default 0
   */
  startingDay?: number;
}

/**
 * @deprecated Use SkyAgGridDatepickerProperties instead.
 */
// eslint-disable-next-line
export interface SkyDatepickerProperties extends SkyAgGridDatepickerProperties {}
