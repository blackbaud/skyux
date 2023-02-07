/**
 * The configuration for a custom date.
 */
export interface SkyDatepickerCustomDate {
  /**
   * The date to customize.
   */
  date: Date;

  /**
   * Whether to disable the date.
   */
  disabled?: boolean;

  /**
   * Whether to display the date as a key date in the calendar.
   */
  keyDate?: boolean;

  /**
   * Displays a popup of the provided text when hovering over the key date in the calendar.
   */
  keyDateText?: Array<string>;
}
