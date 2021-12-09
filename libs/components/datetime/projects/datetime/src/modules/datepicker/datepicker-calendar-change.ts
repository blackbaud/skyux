import { SkyDatepickerCustomDate } from './datepicker-custom-date';
import { Observable } from 'rxjs';

/**
 * Specifies changes in the datepicker calendar.
 */
export interface SkyDatepickerCalendarChange {
  /**
   * The end date.
   */
  endDate: Date;

  /**
   * The start date.
   */
  startDate: Date;

  /**
   * Provides an observable that allows the consumer to push custom dates back to the calendar
   * when the `SkyCalendarDateRangeChangeEvent` event fires. This is useful
   * for displaying key dates or disabled dates each time the calendar changes. If disabled dates
   * are provided, SKY UX will prevent the user from selecting the date from the calendar.
   * However, consumers will still need to add a custom validator to prevent users from entering
   * disabled dates in the text input.
   */
  customDates?: Observable<SkyDatepickerCustomDate[]>;
}
