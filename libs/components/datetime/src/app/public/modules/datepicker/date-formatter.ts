import * as moment_ from 'moment';
const moment = moment_;

export class SkyDateFormatter {

  private static defaultLocale: string = 'en-US';

  private static defaultShortDateFormat: string = 'MM/DD/YYYY';

  /**
   * Sets moment's global locale.
   */
  public static setLocale(locale: string): void {
    moment.locale(locale || SkyDateFormatter.defaultLocale);
  }

  /**
   * Returns the preferred short date format for the current locale.
   */
  public static getPreferredShortDateFormat(): string {
    return moment.localeData().longDateFormat('L') || SkyDateFormatter.defaultShortDateFormat;
  }

  public format(date: Date, format: string): string {
    return moment(date.getTime()).format(format);
  }

  public getDateFromString(dateString: string, format: string, strict: boolean = false): Date {
    let momentValue = moment(dateString, format, strict);

    if (!momentValue.isValid()) {
      momentValue = moment(dateString, 'YYYY-MM-DDThh:mm:ss.sssZ', strict);
    }

    return momentValue.toDate();
  }

  public dateIsValid(date: Date): boolean {
    return (
      date &&
      date instanceof Date &&
      !isNaN(date.valueOf()) &&
      !isNaN(new Date(date).getDate())
    );
  }
}
