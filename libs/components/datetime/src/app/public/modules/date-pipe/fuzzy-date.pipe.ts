import {
  OnDestroy,
  Pipe,
  PipeTransform
} from '@angular/core';

import {
  SkyAppLocaleProvider
} from '@skyux/i18n';

import {
  Subject
} from 'rxjs/Subject';

import 'rxjs/add/operator/takeUntil';

import {
  SkyFuzzyDate
} from '../datepicker/fuzzy-date';

import {
  SkyFuzzyDateService
} from '../datepicker/fuzzy-date.service';

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
  pure: false
})
export class SkyFuzzyDatePipe implements OnDestroy, PipeTransform {

  private defaultLocale: string = 'en-US';

  private ngUnsubscribe = new Subject<void>();

  constructor(
    private fuzzyDateService: SkyFuzzyDateService,
    private localeProvider: SkyAppLocaleProvider
  ) {
    this.localeProvider.getLocaleInfo()
      .takeUntil(this.ngUnsubscribe)
      .subscribe((localeInfo) => {
        this.defaultLocale = localeInfo.locale;
      });
  }

  public ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  /**
   * Transforms fuzzy date values using two or more date tokens that represent the day, month,
   * and year.
   * @param value Specifies the date value to transform.
   * @param format Specifies the format to apply to the transform. You construct the format
   * string with a two or more tokens that specify the components of date-time value. The
   * tokens are described in the [moment.js values](https://momentjs.com/docs/#/displaying/).
   * @param locale Specifies the locale code to use in the transform.
   */
  public transform(
    value: SkyFuzzyDate,
    format: string,
    locale?: string
  ): string {
    if (!value) {
      return undefined;
    }

    if (!format || format.length === 0) {
      console.error('You must provide a format when using the skyFuzzyDate pipe.');
      return;
    }

    const dateLocale = locale || this.defaultLocale;
    const moment = this.fuzzyDateService.getMomentFromFuzzyDate(value);

    return moment.locale(dateLocale).format(format);
  }

}
