import { OnDestroy, Pipe, PipeTransform } from '@angular/core';
import { SkyAppLocaleProvider, SkyIntlNumberFormatStyle } from '@skyux/i18n';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { SkyNumberFormatUtility } from '../shared/number-format/number-format-utility';

@Pipe({
  name: 'skyPercent',
  pure: false,
  standalone: false,
})
export class SkyPercentPipe implements OnDestroy, PipeTransform {
  public get defaultLocale(): string {
    return this.#defaultLocale;
  }

  #defaultFormat = '1.0-2';

  #defaultLocale = 'en-US';

  #format: string | undefined;

  #formattedValue = '';

  #locale: string | undefined;

  #ngUnsubscribe = new Subject<void>();

  #value: string | undefined;

  constructor(localeProvider: SkyAppLocaleProvider) {
    localeProvider
      .getLocaleInfo()
      .pipe(takeUntil(this.#ngUnsubscribe))
      .subscribe((localeInfo) => {
        this.#defaultLocale = localeInfo.locale;
        this.#updateFormattedValue();
      });
  }

  public ngOnDestroy(): void {
    this.#ngUnsubscribe.next();
    this.#ngUnsubscribe.complete();
  }

  public transform(value: string, format?: string, locale?: string): string {
    this.#value = value;
    this.#format = format;
    this.#locale = locale;

    this.#updateFormattedValue();

    return this.#formattedValue;
  }

  #updateFormattedValue(): void {
    const locale = this.#locale || this.#defaultLocale;
    const format = this.#format || this.#defaultFormat;

    this.#formattedValue = this.#value
      ? (SkyNumberFormatUtility.formatNumber(
          locale,
          this.#value,
          SkyIntlNumberFormatStyle.Percent,
          format,
        ) as string)
      : '';
  }
}
