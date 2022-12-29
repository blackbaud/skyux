export interface SkyTimepickerTimeOutput {
  /**
   * Specifies the hour.
   */
  hour: number;

  /**
   * Specifies the minute.
   */
  minute: number;

  /**
   * Specifies the meridian (`AM` or `PM`).
   */
  meridie: string;

  /**
   * Specifies the time zone.
   */
  timezone: number;

  /**
   * Specifies the date in [iso8601 format](https://www.iso.org/iso-8601-date-and-time-format.html).
   */
  iso8601: Date;

  /**
   * Specifies the date in the current local time format.
   */
  local: string;

  /**
   * Specifies the time format string.
   */
  customFormat: string;
}
