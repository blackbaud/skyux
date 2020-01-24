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
 * Formats a fuzzy date value according to locale rules.
 * You can construct a format string using symbols to specify the components
 * of a date-time value, as described in the following table.
 * These fields are based on the [moment.js values](https://momentjs.com/docs/#/displaying/)
 *
 *  | Field type         | Token      | Output
 *  |--------------------|------------|
 *  | Month              | M          | 1 2 ... 11 12
 *  |                    | Mo         | 1st 2nd ... 11th 12th
 *  |                    | MM         | 01 02 ... 11 12
 *  |                    | MMM        | Jan Feb ... Nov Dec
 *  |                    | MMMM       | January February ... November December
 *  | Day                | D          | 1 2 ... 30 31
 *  |                    | Do         | 1st 2nd ... 30th 31st
 *  |                    | DD         | 01 02 ... 30 31
 *  | Year               | YY         | 70 71 ... 29 30
 *  |                    | YYYY       | 1970 1971 ... 2029 2030
 *  |                    | Y          | 1970 1971 ... 9999 +10000 +10001
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
