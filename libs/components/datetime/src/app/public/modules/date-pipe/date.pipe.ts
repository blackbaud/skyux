import {
  ChangeDetectorRef,
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
  SkyDateFormatUtility
} from './date-format-utility';

@Pipe({
  name: 'skyDate',
  pure: false
})
export class SkyDatePipe implements OnDestroy, PipeTransform {

  private defaultFormat = 'short';

  private format: string;

  private defaultLocale = 'en-US';

  private locale: string;

  private value: Date;

  private formattedValue: string;

  private ngUnsubscribe = new Subject<void>();

  constructor(
    private changeDetector: ChangeDetectorRef,
    private localeProvider: SkyAppLocaleProvider
  ) {
    this.localeProvider.getLocaleInfo()
      .takeUntil(this.ngUnsubscribe)
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
    value: Date,
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

    this.formattedValue = SkyDateFormatUtility.format(locale, this.value, format);

    this.changeDetector.markForCheck();
  }
}
