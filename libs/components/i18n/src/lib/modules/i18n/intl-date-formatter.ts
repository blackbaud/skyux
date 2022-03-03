import { dateFormatter } from './intl-date-formatter-utils';

export class SkyIntlDateFormatter {
  /* istanbul ignore next */

  public static format(date: Date, locale: string, pattern: string): string {
    return dateFormatter(pattern, date, locale);
  }
}
