import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class SkyDatepickerConfigService {
  /**
   * Specifies the date format for the input.
   * @default MM/DD/YYYY
   */
  public dateFormat: string;

  /**
   * Specifies the latest selectable date that is available in the calendar.
   */
  public maxDate: Date;

  /**
   * Specifies the earliest selectable date that is available in the calendar.
   */
  public minDate: Date;

  /**
   * Specifies the starting day of the week in the calendar,
   * where `0` sets the starting day to Sunday.
   * @default 0
   */
  public startingDay = 0;
}
