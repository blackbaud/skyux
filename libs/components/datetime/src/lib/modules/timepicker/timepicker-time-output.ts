import { SkyTimepickerTimeOutputMeridieType } from './timepicker-time-output-meridie-type';

export interface SkyTimepickerTimeOutput {
  /**
   * The hour.
   */
  hour: number;

  /**
   * The minute.
   */
  minute: number;

  /**
   * The meridian (`AM` or `PM`).
   */
  meridie: SkyTimepickerTimeOutputMeridieType;

  /**
   * The time zone.
   */
  timezone: number;

  /**
   * The date in [iso8601 format](https://www.iso.org/iso-8601-date-and-time-format.html).
   */
  iso8601: Date;

  /**
   * The date in the current local time format.
   */
  local: string;

  /**
   * The time format string.
   */
  customFormat: string;
}
