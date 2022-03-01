// This class is mostly ported from the Angular 4.x DatePipe in order to maintain the old
// behavior of using the `Intl` API for formatting dates rather than having to register every
// supported locale.
// https://github.com/angular/angular/blob/4.4.x/packages/common/src/pipes/date_pipe.ts
import { SkyIntlDateFormatter } from '@skyux/i18n';

import moment from 'moment';

export class SkyDateFormatUtility {
  private static _ALIASES: { [key: string]: string } = {
    medium: 'yMMMdjms',
    short: 'yMdjm',
    fullDate: 'yMMMMEEEEd',
    longDate: 'yMMMMd',
    mediumDate: 'yMMMd',
    shortDate: 'yMd',
    mediumTime: 'jms',
    shortTime: 'jm',
  };

  /* istanbul ignore next */
  constructor() {}

  public static format(
    locale: string,
    value: any,
    pattern: string
  ): string | null {
    let date: Date;

    if (isBlank(value) || value !== value) {
      return undefined;
    }

    // Moment will interpret any non-date object as today's date. That would
    // introduce a breaking change, so we check for it here. This could probably be removed
    // in a future major version.
    if (value instanceof Object && !(value instanceof Date)) {
      handleInvalidDate(value);
    }

    // Use moment to avoid inconsistencies between browsers interpreting the value differently.
    const momentDate = moment(value);
    if (momentDate.isValid()) {
      date = momentDate.toDate();
    } else {
      handleInvalidDate(value);
    }

    return SkyIntlDateFormatter.format(
      date,
      locale,
      SkyDateFormatUtility._ALIASES[pattern] || pattern
    );
  }
}

function isBlank(obj: any): boolean {
  return !obj;
}

function handleInvalidDate(value: any): void {
  throw new Error('Invalid value: ' + value);
}
