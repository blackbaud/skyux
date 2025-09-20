// This class is mostly ported from the Angular 4.x DatePipe in order to maintain the old
// behavior of using the `Intl` API for formatting dates rather than having to register every
// supported locale.
// https://github.com/angular/angular/blob/4.4.x/packages/common/src/pipes/date_pipe.ts
import { Injectable, OnDestroy, inject } from '@angular/core';
import {
  SkyAppLocaleInfo,
  SkyAppLocaleProvider,
  SkyIntlDateFormatter,
} from '@skyux/i18n';

import moment from 'moment';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

/**
 * @internal
 */
@Injectable({
  providedIn: 'root',
})
export class SkyDateService implements OnDestroy {
  /* spell-checker:disable */
  // See: https://github.com/angular/angular/blob/17.3.x/packages/common/src/pipes/date_pipe.ts
  // See: https://www.ibm.com/docs/en/app-connect/11.0.0?topic=function-formatting-parsing-datetimes-as-strings
  #ALIASES: Record<string, string> = {
    // TODO: replace with 'M/d/yy, h:mm a' in a breaking change.
    short: 'yMdjm',
    // TODO: replace with 'MMM d, y, h:mm:ss a' in a breaking change.
    medium: 'yMMMdjms',
    // TODO: This format was modified from 'MMMM d, y, h:mm:ss a z' due to the limitations of the Intl API.
    long: 'MMMM d, y, h:mm:ss a Z',
    // TODO: This format was modified from 'EEEE, MMMM d, y, h:mm:ss a zzzz' due to the limitations of the Intl API.
    full: 'EEEE, MMMM d, y, h:mm:ss a z',
    // TODO: Replace with 'M/d/yy' in a breaking change.
    shortDate: 'yMd',
    // TODO: Replace with 'MMM d, y' in a breaking change.
    mediumDate: 'yMMMd',
    // TODO: Replace with 'MMMM d, y' in a breaking change.
    longDate: 'yMMMMd',
    // TODO: Replace with 'EEEE, MMMM d, y' in a breaking change.
    fullDate: 'yMMMMEEEEd',
    // TODO: Replace with 'h:mm a' in a breaking change.
    shortTime: 'jm',
    // TODO: Replace with 'h:mm:ss a' in a breaking change.
    mediumTime: 'jms',
    // TODO: This format was modified from 'h:mm:ss a z' due to the limitations of the Intl API.
    longTime: 'h:mm:ss a Z',
    // TODO: This format was modified from 'h:mm:ss a zzzz' due to the limitations of the Intl API.
    fullTime: 'h:mm:ss a z',
  };
  /* spell-checker:enable */

  #defaultFormat = 'short';
  #defaultLocale = 'en-US';
  #ngUnsubscribe = new Subject<void>();

  constructor() {
    inject(SkyAppLocaleProvider)
      .getLocaleInfo()
      .pipe(takeUntil(this.#ngUnsubscribe))
      .subscribe((localeInfo: SkyAppLocaleInfo) => {
        this.#defaultLocale = localeInfo.locale;
      });
  }

  public ngOnDestroy(): void {
    this.#ngUnsubscribe.next();
    this.#ngUnsubscribe.complete();
  }

  public format(
    value: any,
    locale?: string,
    format?: string,
  ): string | undefined {
    let date: Date;
    const pattern = format || this.#defaultFormat;

    if (isBlank(value) || value !== value) {
      return undefined;
    }

    // Moment will interpret any non-date object as today's date. That would
    // introduce a breaking change, so we check for it here. This could probably be removed
    // in a future major version.
    if (value instanceof Object && !(value instanceof Date)) {
      throw new Error('Invalid value: ' + value);
    }

    // Use moment to avoid inconsistencies between browsers interpreting the value differently.
    const momentDate = moment(value);
    if (momentDate.isValid()) {
      date = momentDate.toDate();
    } else {
      throw new Error('Invalid value: ' + value);
    }

    return SkyIntlDateFormatter.format(
      date,
      locale || this.#defaultLocale,
      this.#ALIASES[pattern] || pattern,
    );
  }
}

function isBlank(obj: any): boolean {
  return !obj;
}
