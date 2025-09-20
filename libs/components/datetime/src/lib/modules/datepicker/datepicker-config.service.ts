import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class SkyDatepickerConfigService {
  /**
   * The date format for the input.
   * @default "MM/DD/YYYY"
   */
  public dateFormat: string | undefined;

  /**
   * The latest selectable date that is available in the calendar.
   */
  public maxDate: Date | undefined;

  /**
   * The earliest selectable date that is available in the calendar.
   */
  public minDate: Date | undefined;

  /**
   * The date to open the calendar to initially.
   * @default the current date
   */
  public startAtDate: Date | undefined;

  /**
   * The starting day of the week in the calendar,
   * where `0` sets the starting day to Sunday.
   * @default 0
   */
  public startingDay = 0;
}
