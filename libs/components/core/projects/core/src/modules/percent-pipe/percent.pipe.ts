import {
  OnDestroy,
  Pipe,
  PipeTransform
} from '@angular/core';

import {
  SkyAppLocaleProvider,
  SkyIntlNumberFormatStyle
} from '@skyux/i18n';

import {
  Subject
} from 'rxjs';

import {
  takeUntil
} from 'rxjs/operators';

import {
  SkyNumberFormatUtility
} from '../shared/number-format/number-format-utility';

@Pipe({
  name: 'skyPercent',
  pure: false
})
export class SkyPercentPipe implements OnDestroy, PipeTransform {

  private defaultFormat = '1.0-2';

  private format: string;

  private defaultLocale = 'en-US';

  private locale: string;

  private value: string;

  private formattedValue: string;

  private ngUnsubscribe = new Subject<void>();

  constructor(
    private localeProvider: SkyAppLocaleProvider
  ) {
    this.localeProvider.getLocaleInfo()
      .pipe(
        takeUntil(this.ngUnsubscribe)
      )
      .subscribe((localeInfo) => {
        this.defaultLocale = localeInfo.locale;
        this.updateFormattedValue();
      });
  }

  public ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  public transform(
    value: string,
    format?: string,
    locale?: string
  ): string {
    this.value = value;
    this.format = format;
    this.locale = locale;

    this.updateFormattedValue();

    return this.formattedValue;
  }

  private updateFormattedValue(): void {
    const locale = this.locale || this.defaultLocale;
    const format = this.format || this.defaultFormat;

    this.formattedValue = SkyNumberFormatUtility.formatNumber(locale, this.value, SkyIntlNumberFormatStyle.Percent, format);
  }
}
