import {
  ChangeDetectorRef,
  OnDestroy,
  Pipe,
  PipeTransform,
} from '@angular/core';
import { SkyAppLocaleProvider } from '@skyux/i18n';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { NumericOptions, SkyNumericOptions } from './numeric.options';
import { SkyNumericService } from './numeric.service';

/**
 * Shortens numbers to rounded numbers and abbreviation characters such as K for thousands,
 * M for millions, B for billions, and T for trillions. The pipe also formats for currency.
 * Be sure you have a space after the two curly brackets opening the pipe and
 * a space before the two curly brackets closing the pipe or it will not work.
 */
@Pipe({
  name: 'skyNumeric',
  pure: false,
})
export class SkyNumericPipe implements PipeTransform, OnDestroy {
  #cacheKey: string | undefined;

  #changeDetector: ChangeDetectorRef;

  #formattedValue: string | undefined;

  #ngUnsubscribe = new Subject<void>();

  #numericSvc: SkyNumericService;

  #providerLocale: string | undefined;

  constructor(
    localeProvider: SkyAppLocaleProvider,
    numericSvc: SkyNumericService,
    changeDetector: ChangeDetectorRef,
  ) {
    this.#numericSvc = numericSvc;
    this.#changeDetector = changeDetector;

    localeProvider
      .getLocaleInfo()
      .pipe(takeUntil(this.#ngUnsubscribe))
      .subscribe((localeInfo) => {
        this.#providerLocale = localeInfo.locale;
        numericSvc.currentLocale = this.#providerLocale;
        this.#changeDetector.markForCheck();
      });
  }

  public ngOnDestroy(): void {
    this.#ngUnsubscribe.next();
    this.#ngUnsubscribe.complete();
  }

  /**
   * Formats a number based on the provided options.
   */
  public transform(
    value: number | undefined | null,
    config?: SkyNumericOptions,
  ): string {
    if (value === undefined || value === null || isNaN(value)) {
      return '';
    }

    const newCacheKey =
      (config ? JSON.stringify(config, Object.keys(config).sort()) : '') +
      `${value}_${config?.locale || this.#providerLocale}`;

    /* If the value and locale are the same as the last transform then return the previous value
    instead of reformatting. */
    if (this.#formattedValue && this.#cacheKey === newCacheKey) {
      return this.#formattedValue;
    }

    const options = new NumericOptions();

    // The default number of digits is `1`. When truncate is disabled, set digits
    // to `0` to avoid the unnecessary addition of `.0` at the end of the formatted number.
    if (config && config.truncate === false && config.digits === undefined) {
      options.digits = 0;
    }

    // If the minimum digits is less than the set maximum digits then throw an error
    if (
      config &&
      config.minDigits &&
      config.digits &&
      config.minDigits > config.digits
    ) {
      throw new Error(
        'The `digits` property must be greater than or equal to the `minDigits` property',
      );

      // If there is a minimum digits given but not a maximum then default the maximum to the minimum
    } else if (config && config.minDigits && !config.digits) {
      options.digits = config.minDigits;
    }

    Object.assign(options, config);

    // Assign properties for proper result caching.
    this.#cacheKey = newCacheKey;

    this.#formattedValue = this.#numericSvc.formatNumber(value, options);
    return this.#formattedValue;
  }
}
