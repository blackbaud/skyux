import moment from 'moment';

export class SkyDateFormatter {
  private static defaultLocale = 'en-US';

  private static defaultShortDateFormat = 'MM/DD/YYYY';

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
    /* istanbul ignore next */
    return (
      moment.localeData().longDateFormat('L') ||
      SkyDateFormatter.defaultShortDateFormat
    );
  }

  public format(date: Date, format: string): string {
    return moment(date.getTime()).format(format);
  }

  public getDateFromString(
    dateString: string,
    format: string,
    /* istanbul ignore next */
    strict: boolean = false
  ): Date {
    let momentValue = moment(dateString, format, strict);

    if (!momentValue.isValid()) {
      momentValue = moment(dateString, 'YYYY-MM-DDThh:mm:ss.SZ', strict);
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
  public dateFromUserInput(inputValue: string, format: string, strict: boolean): Date {
    const sep = '/';
    const pattern = format.toUpperCase();
    let date = undefined;
    if (!inputValue) {
      return undefined;
    }
    inputValue = (`${inputValue}`).replace(/[^\d]/g, sep);
    if (inputValue && inputValue.replace(/[^\d]/g, '').length === 0) {
      inputValue = '';
    }
    if (inputValue) {
      let valueParts = inputValue.split(sep, 3);
      date = this.getDateFromString(inputValue, pattern, strict);
      if (!date || valueParts.length !== 3) {
        const today = new Date(),
          thisYear = today.getUTCFullYear(),
          patternParts = pattern.split(sep),
          dayIdx = patternParts.findIndex(item => item.indexOf('D') > -1),
          monthIdx = patternParts.findIndex(item => item.indexOf('M') > -1),
          yearIdx = patternParts.findIndex(item => item.indexOf('Y') > -1);
        let month = today.getUTCMonth() + 1, //months are 0 based, but we need to process as 1 based
          day = today.getUTCDate(),
          year = thisYear,
          tmp = 0;

        const fixYearText = (yearText) => {
          const thisYearText = `${thisYear}`;
          if (yearText !== undefined && yearText !== '') {
            yearText = `${yearText}`;
            if (yearText.length < 4 && thisYearText.length > yearText.length) {
              yearText = thisYearText.substring(0, thisYearText.length - yearText.length) + yearText;
            }
            return yearText;
          }
          return thisYearText;
        };
        if (valueParts.length === 1) {
          if (valueParts[0].length === 8) {
            //assume full date with no separators
            valueParts = ['', '', ''];
            valueParts[monthIdx] = inputValue.substr((((dayIdx < monthIdx) ? 2 : 0) + ((yearIdx < monthIdx) ? 4 : 0)), 2);
            valueParts[dayIdx] = inputValue.substr((((monthIdx < dayIdx) ? 2 : 0) + ((yearIdx < dayIdx) ? 4 : 0)), 2);
            valueParts[yearIdx] = inputValue.substr((((monthIdx < yearIdx) ? 2 : 0) + ((dayIdx < yearIdx) ? 2 : 0)), 4);
          } else if (valueParts[0].length === 6) {
            //assume full date with two digit year with no separators
            valueParts = ['', '', ''];
            valueParts[monthIdx] = inputValue.substr((((dayIdx < monthIdx) ? 2 : 0) + ((yearIdx < monthIdx) ? 2 : 0)), 2);
            valueParts[dayIdx] = inputValue.substr((((monthIdx < dayIdx) ? 2 : 0) + ((yearIdx < dayIdx) ? 2 : 0)), 2);
            valueParts[yearIdx] = inputValue.substr((((monthIdx < yearIdx) ? 2 : 0) + ((dayIdx < yearIdx) ? 2 : 0)), 2);
          } else if (valueParts[0].length === 4) {
            //assume day month
            valueParts = ['', '', ''];
            valueParts[monthIdx] = inputValue.substr(((dayIdx < monthIdx) ? 2 : 0), 2);
            valueParts[dayIdx] = inputValue.substr(((monthIdx < dayIdx) ? 2 : 0), 2);
            valueParts[yearIdx] = `${thisYear}`;
          }
        }
        switch (valueParts.length) {
          case 1:
            //only a single value was entered - treat it like a day unless it couldn't be, then treat it like a year
            tmp = parseInt(inputValue);
            if (tmp > 31) {
              year = tmp;
            } else {
              day = tmp;
            }
            date = new Date(year, month - 1, day);
            break;
          case 2:
            month = parseInt(valueParts[monthIdx]);
            day = parseInt(valueParts[dayIdx]);
            year = parseInt(fixYearText(valueParts[yearIdx]));
            date = new Date(year, month - 1, day);
            break;
          case 3:
            month = parseInt(valueParts[monthIdx]);
            day = parseInt(valueParts[dayIdx]);
            year = parseInt(fixYearText(valueParts[yearIdx]));
            date = new Date(year, month - 1, day);
            break;
        }
      }
    }
    return date;
  }
}
