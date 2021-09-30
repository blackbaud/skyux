import {
  Injectable,
  OnDestroy
} from '@angular/core';

import {
  SkyAppLocaleProvider
} from '@skyux/i18n';

import {
  Subject
} from 'rxjs';

import {
  takeUntil
} from 'rxjs/operators';

import {
  SkyFuzzyDate
} from './fuzzy-date';

import moment from "moment"

/**
 * @internal
 */
interface SkyDateIndexes {
  yearIndex: number;
  monthIndex: number;
  dayIndex: number;
}

/**
 * @internal
 */
interface SkyFuzzyDateRange {
  years: string;
  months: string;
  days: string;
  valid: boolean;
}

/**
 * @internal
 */
@Injectable({
  providedIn: 'root'
})
export class SkyFuzzyDateService implements OnDestroy {

  private currentLocale: string;

  private ngUnsubscribe = new Subject<void>();

  constructor(
    private localeProvider: SkyAppLocaleProvider
  ) {
    this.localeProvider.getLocaleInfo()
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((localeInfo) => {
        this.currentLocale = localeInfo.locale;
      });
  }

  /* istanbul ignore next */
  public ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  /**
   * Returns the browser's current locale string.
   */
  public getCurrentLocale(): string {
    return this.currentLocale;
  }

  /**
   * Returns the short format of the provided locale.
   * If not provided, the locale will be taken from the browser's default locale.
   */
  public getLocaleShortFormat(locale?: string): string {
    return moment.localeData(locale || this.currentLocale).longDateFormat('L');
  }

  /**
   * Formats a fuzzy date by using the provided format and locale strings.
   * If not provided, the locale will be taken from the browser's default locale.
   */
  public format(fuzzyDate: SkyFuzzyDate, format: string, locale?: string): string {

    if (!this.isFuzzyDateValid(fuzzyDate)) {
      return '';
    }

    if (!format) {
      return '';
    }

    const separator = this.getDateSeparator(format);
    let dateParts: string[] = [];
    let formatTokens: string[] = format.split(separator);
    locale = locale || this.currentLocale;
    let fuzzyDateMoment = this.getMomentFromFuzzyDate(fuzzyDate).locale(locale);

    for (let index = 0; index < formatTokens.length; index++) {
      const token = formatTokens[index];

      /* istanbul ignore else */
      if (token) {
        // tslint:disable-next-line: switch-default
        switch (token.substr(0, 1).toLowerCase()) {
          case 'y':
            if (fuzzyDate.year) {
              dateParts.push(
                fuzzyDateMoment.format(token)
              );
            }
            break;
          case 'm':
            if (fuzzyDate.month) {
              dateParts.push(
                fuzzyDateMoment.format(token)
              );
            }
            break;
          case 'd':
            if (fuzzyDate.day) {
              dateParts.push(
                fuzzyDateMoment.format(token)
              );
            }
            break;
        }
      }
    }

    return dateParts.join(separator);
  }

  /**
   * If not provided, years will default to current year; months will default to January;
   * days will default to 1st of the month.
   */
  public getMomentFromFuzzyDate(fuzzyDate: SkyFuzzyDate): any {
    if (!fuzzyDate) {
      return;
    }

    const year = fuzzyDate.year || this.getDefaultYear(fuzzyDate);
    const month = fuzzyDate.month > 0 ? (fuzzyDate.month - 1) : 0;
    const day = fuzzyDate.day || 1;

    return moment([year, month, day]);
  }

  /**
   * Gets a string instance of a fuzzy date.
   * @deprecated Deprecated in favor of the `format` function.
   */
  public getStringFromFuzzyDate(fuzzyDate: SkyFuzzyDate, dateFormat: string): string {
    if (!fuzzyDate || !dateFormat) {
      return;
    }

    const separator = this.getDateSeparator(dateFormat);
    const dateFormatIndexes = this.getDateFormatIndexes(dateFormat);
    let dateString: string = '';

    // Get the components of the date in the order expected of the local format.
    let dateComponents = [
      { value: fuzzyDate.year || 0, index: dateFormatIndexes.yearIndex },
      { value: fuzzyDate.month || 0, index: dateFormatIndexes.monthIndex },
      { value: fuzzyDate.day || 0, index: dateFormatIndexes.dayIndex }
    ];
    dateComponents.sort((a: any, b: any) => a.index - b.index);

    dateComponents.forEach(component => {
      if (component.value > 0 && component.index > -1) {
        if (dateString) {
          dateString += separator;
        }
        dateString += component.value.toString();
      }
    });

    return dateString.trim();
  }

  public getFuzzyDateFromSelectedDate(selectedDate: Date, dateFormat: string): SkyFuzzyDate {
    if (!selectedDate || !dateFormat) {
      return;
    }

    let fuzzyDate: SkyFuzzyDate = {};
    const dateFormatIndexes = this.getDateFormatIndexes(dateFormat);

    if (dateFormatIndexes.yearIndex > -1) {
      fuzzyDate.year = selectedDate.getFullYear();
    }

    if (dateFormatIndexes.dayIndex > -1) {
      fuzzyDate.day = selectedDate.getDate();
    }

    if (dateFormatIndexes.monthIndex > -1) {
      fuzzyDate.month = selectedDate.getMonth() + 1; // getMonth() is 0-indexed.
    }

    return fuzzyDate;
  }

  public getFuzzyDateFromString(date: string, dateFormat: string): SkyFuzzyDate {
    if (!date || !dateFormat) {
      return;
    }

    let day: any;
    let month: any;
    let year: any;

    const dateComponents = this.getDateComponents(date);
    const indexes = this.getDateValueIndexes(date, dateFormat);

    // Look at the date string's component count:
    // 3 indicates a full date
    // 2 indicates a month-year or month-day date
    // 1 indicates a year
    // Other indicates a problem
    switch (dateComponents.length) {
    case 3:
      year = dateComponents[indexes.yearIndex];
      month = dateComponents[indexes.monthIndex];
      day = dateComponents[indexes.dayIndex];
      break;
    case 2:
      // First, check for a 4-digit year. If year exists, then we assume the other component
      // is the month. Otherwise, we can assume the input is mm/dd or mm/yy (2-digit year).
      year = this.get4DigitYearFromDateString(date);
      if (year) {
        month = dateComponents[0] === year.toString() ? dateComponents[1] : dateComponents[0];
      } else {
        if (indexes.dayIndex > -1) {
          // mm/dd
          month = (indexes.monthIndex < indexes.dayIndex) ? dateComponents[0] : dateComponents[1];
          day = (month === dateComponents[1]) ? dateComponents[0] : dateComponents[1];
        } else {
          // mm/yy
          month = (indexes.monthIndex < indexes.yearIndex) ? dateComponents[0] : dateComponents[1];
          year = (month === dateComponents[1]) ? dateComponents[0] : dateComponents[1];
        }
      }
      break;
    case 1:
      year = date;
      break;
    default:
      return;
    }

    if (month) {
      // Check if month is valid.
      month = this.getMonthNumber(month);
      if (month === undefined) {
        return;
      }

      // Check if day is valid.
      if (day) {
        day = parseInt(day, 10);
        let fuzzyMoment = this.getMomentFromFuzzyDate({ month: month, day: day, year: year });
        if (isNaN(day) || !fuzzyMoment.isValid()) {
          return;
        }
      }
    }

    if (year) {
      year = year.toString().length === 2 ? moment.parseTwoDigitYear(year) : parseInt(year.toString(), 10);
      if (isNaN(year) || year.toString().length !== 4) {
        return;
      }
    }

    return {
      month: month,
      day: day,
      year: year
    };
  }

  public getFuzzyDateRange(startFuzzyDate: SkyFuzzyDate, endFuzzyDate: SkyFuzzyDate): SkyFuzzyDateRange {
    let start;
    let end;
    let days;
    let months;
    let years;
    let valid = false;

    if (startFuzzyDate && startFuzzyDate.year && endFuzzyDate && endFuzzyDate.year) {
      start = this.getMomentFromFuzzyDate(startFuzzyDate);
      end = this.getMomentFromFuzzyDate(endFuzzyDate);

      years = end.diff(start, 'years');
      months = end.diff(start, 'months');
      days = end.diff(start, 'days');
      valid = end.diff(start) >= 0;
    }

    return {
      years: years,
      months: months,
      days: days,
      valid: valid
    };
  }

  public getCurrentFuzzyDate(): SkyFuzzyDate {
    let currentDate = moment();

    return {
      day: currentDate.date(),
      month: currentDate.month() + 1, // month() is 0-indexed.
      year: currentDate.year()
    };
  }

  private getMostRecentLeapYear(): number {
    let leapYear = new Date().getFullYear();

    while (!this.isLeapYear(leapYear)) {
      leapYear -= 1;
    }

    return leapYear;
  }

  /**
   * Returns the first separator found in the provided date format string.
   * Accepted separators: ['/', '.', '-', ' '].
   * @param dateFormat
   */
  private getDateSeparator(dateFormat: string): string {
    let returnValue: string;
    let separators = ['/', '.', '-', ' '];

    separators.forEach(separator => {
      if (!returnValue && dateFormat.indexOf(separator) > 0) {
        returnValue = separator;
      }
    });

    return returnValue;
  }

  private get4DigitYearFromDateString(date: string): number {
    let year: string;
    const separator = this.getDateSeparator(date);

    // Find the number value in the string that is 4 digits long.
    date.split(separator).forEach(dateComponent => {
      if (!year && parseInt(dateComponent, 10).toString().length === 4) {
        year = dateComponent;
      }
    });

    if (year && !isNaN(Number(year))) {
      return parseInt(year, 10);
    }
  }

  private isLeapYear(year: number): boolean {
    return ((year % 4 === 0) && (year % 100 !== 0)) || (year % 400 === 0);
  }

  private getMonthNumber(month: string): number {
    let returnValue: number;
    const monthAsNumber = parseInt(month, 10);

    // If the month component is a string ("Janaury"), we check to see if it is a valid month
    if (isNaN(monthAsNumber)) {
      if (!moment(month, 'MMMM').isValid()) {
        return;
      }
      returnValue = parseInt(moment().month(month).format('M'), 10);
    } else {
      returnValue = monthAsNumber;
    }

    // Ensure that the month is between 1 and 12
    if (!(1 <= returnValue && returnValue <= 12)) {
      return;
    }

    return returnValue;
  }

  private getDefaultYear(fuzzyDate: SkyFuzzyDate): number {
    // Check if we need to return a leap year or the current year.
    if (fuzzyDate.month === 2 && fuzzyDate.day === 29) {
      return this.getMostRecentLeapYear();
    } else {
      return new Date().getFullYear();
    }
  }

  private getDateComponents(date: string): string[] {
    const separator = this.getDateSeparator(date);
    return date.split(separator);
  }

  // Returns the order of year, month, and day from the provided date format.
  private getDateFormatIndexes(dateFormat: string): SkyDateIndexes {
    dateFormat = dateFormat.toLowerCase();
    return {
      yearIndex: dateFormat.indexOf('y'),
      monthIndex: dateFormat.indexOf('m'),
      dayIndex: dateFormat.indexOf('d')
    };
  }

  // Returns the index of each of the date components in the provided string (month, day, year).
  private getDateValueIndexes(date: string, dateFormat: string): SkyDateIndexes {
    const dateFormatIndexes = this.getDateFormatIndexes(dateFormat);
    let dateComponentIndexes = [];
    if (dateFormatIndexes.yearIndex > -1) {
      dateComponentIndexes.push(dateFormatIndexes.yearIndex);
    }

    if (dateFormatIndexes.monthIndex > -1) {
      dateComponentIndexes.push(dateFormatIndexes.monthIndex);
    }

    if (dateFormatIndexes.dayIndex > -1) {
      dateComponentIndexes.push(dateFormatIndexes.dayIndex);
    }

    dateComponentIndexes.sort(function (a, b) { return a - b; });

    return {
      yearIndex: dateComponentIndexes.indexOf(dateFormatIndexes.yearIndex),
      monthIndex: dateComponentIndexes.indexOf(dateFormatIndexes.monthIndex),
      dayIndex: dateComponentIndexes.indexOf(dateFormatIndexes.dayIndex)
    };
  }

  /**
   * Validates the provided SkyFuzzyDate object. Valid fuzzy dates are as follows:
   * month, day, year
   * month, year
   * month, day
   * year only
   */
  private isFuzzyDateValid(fuzzyDate: SkyFuzzyDate): boolean {

    if (!fuzzyDate) {
      return false;
    }

    // If none of the dates part are specified, return false.
    if (!fuzzyDate.day && !fuzzyDate.month && !fuzzyDate.year) {
      return false;
    }

    // If only month is specified, return false.
    if (!fuzzyDate.day && fuzzyDate.month && !fuzzyDate.year) {
      return false;
    }

    // If only day is specified, return false.
    if (fuzzyDate.day && !fuzzyDate.month && !fuzzyDate.year) {
      return false;
    }

    return true;
  }
}
