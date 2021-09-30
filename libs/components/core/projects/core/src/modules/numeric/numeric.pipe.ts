import {
  Pipe,
  PipeTransform,
  OnDestroy
} from '@angular/core';

import {
  SkyAppLocaleProvider
} from '@skyux/i18n';

import {
  takeUntil
} from 'rxjs/operators';

import {
  Subject
} from 'rxjs';

import {
  SkyNumericService
} from './numeric.service';

import {
  NumericOptions
} from './numeric.options';

/**
 * Shorten numbers to rounded numbers and abbreviation characters such as K for thousands,
 * M for millions, B for billions, and T for trillion. The pipe also formats for currency.
 * Be sure you have a space after the two curly brackets opening the pipe and
 * a space before the two curly brackets closing the pipe or it will not work.
 * Usage:
 * ```
 * {{ value | skyNumeric(config) }}
 * ```
 */
@Pipe({
  name: 'skyNumeric'
})
export class SkyNumericPipe implements PipeTransform, OnDestroy {

  private ngUnsubscribe = new Subject<void>();

  constructor(
    private localeProvider: SkyAppLocaleProvider,
    private readonly numericService: SkyNumericService
  ) {
    this.localeProvider.getLocaleInfo()
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((localeInfo) => {
        numericService.currentLocale = localeInfo.locale;
      });
  }

  public ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  public transform(value: number, config?: NumericOptions): string {
    const options = new NumericOptions();

    // The default number of digits is `1`. When truncate is disabled, set digits
    // to `0` to avoid the unnecessary addition of `.0` at the end of the formatted number.
    if (
      config &&
      config.truncate === false &&
      config.digits === undefined
    ) {
      config.digits = 0;
    }

    // If the minimum digits is less than the set maximum digits then throw an error
    if (
      config &&
      config.minDigits &&
      config.digits &&
      config.minDigits > config.digits
    ) {
      throw new Error(
        'The `digits` property must be greater than or equal to the `minDigits` property'
      );

    // If there is a minimum digits given but not a maximum then default the maximum to the minimum
    } else if (
      config &&
      config.minDigits &&
      !config.digits
    ) {
      config.digits = config.minDigits;
    }

    Object.assign(options, config);

    return this.numericService.formatNumber(value, options);
  }
}
