import { Pipe, PipeTransform } from '@angular/core';

import { SkyFuzzyDate } from '../datepicker/fuzzy-date';

import { SkyFuzzyDateService } from '../datepicker/fuzzy-date.service';

/**
 * Formats date values using two or more date tokens that represent the day, month,
 * and year. The tokens are described in the [moment.js values](https://momentjs.com/docs/#/displaying/).
 * @example
 * ```markup
 * {{ myFuzzyDate | skyFuzzyDate:'MMM Y' }}
 * {{ myFuzzyDate | skyFuzzyDate:'MMM Y':'en-CA' }}
 * ```
 */
@Pipe({
  name: 'skyFuzzyDate',
  pure: false,
})
export class SkyFuzzyDatePipe implements PipeTransform {
  constructor(private fuzzyDateService: SkyFuzzyDateService) {}

  /**
   * Transforms fuzzy date values using two or more date tokens that represent the day, month,
   * and year.
   * @param value Specifies the date value to transform.
   * @param format Specifies the format to apply to the transform. You construct the format
   * string with a two or more tokens that specify the components of date-time value. The
   * tokens are described in the [moment.js values](https://momentjs.com/docs/#/displaying/).
   * If you don't provide a format, `SkyFuzzyDatePipe` attempts to format fuzzy dates based
   * on the browser's default locale.
   * @param locale Specifies the locale code to use in the transform.
   */
  public transform(
    value: SkyFuzzyDate,
    format?: string,
    locale?: string
  ): string {
    if (!value) {
      return undefined;
    }
    const fuzzyDateFormat =
      format || this.fuzzyDateService.getLocaleShortFormat(locale);
    const fuzzyDateLocale = locale || this.fuzzyDateService.getCurrentLocale();
    return this.fuzzyDateService.format(
      value,
      fuzzyDateFormat,
      fuzzyDateLocale
    );
  }
}
