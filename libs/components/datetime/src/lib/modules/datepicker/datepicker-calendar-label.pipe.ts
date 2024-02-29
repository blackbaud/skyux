import { Pipe, PipeTransform, inject } from '@angular/core';

import { SkyDatepickerCalendarInnerComponent } from './datepicker-calendar-inner.component';

/**
 * Formats date values according to formatting rules.
 * @example
 * ```markup
 * {{ myDate | skyDatepickerCalendarLabel }}
 * {{ myDate | skyDatepickerCalendarLabel:'YYYY' }}
 * ```
 * @internal
 */
@Pipe({
  name: 'skyDatepickerCalendarLabel',
  standalone: true,
})
export class SkyDatepickerCalendarLabelPipe implements PipeTransform {
  #datepicker = inject(SkyDatepickerCalendarInnerComponent);
  #defaultFormat = this.#datepicker.formatDayLabel;

  /**
   * Transforms a date value using locale and format rules.
   * @param value Specifies the date value to transform.
   * @param format Specifies the format to apply to the transform. The format string is
   * constructed by a series of symbols that represent date-time values.
   */
  public transform(value: unknown, format?: string): string {
    let formattedValue = '';

    if (value && value instanceof Date) {
      formattedValue = this.#datepicker.dateFilter(
        value,
        format || this.#defaultFormat,
      );
    }

    return formattedValue;
  }
}
