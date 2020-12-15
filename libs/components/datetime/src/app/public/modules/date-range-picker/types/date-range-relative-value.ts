import {
  SkyDateRange
} from './date-range';

/**
 * Need to add the following to classes which contain static methods.
 * See: https://github.com/ng-packagr/ng-packagr/issues/641
 * @internal
 * @dynamic
 */
export abstract class SkyDateRangeRelativeValue {

  // Abstract classes are not covered properly.
  /* istanbul ignore next */
  constructor () {}

  public static get today(): SkyDateRange {
    const today = new Date();

    return {
      startDate: today,
      endDate: today
    };
  }

  public static get tomorrow(): SkyDateRange {
    const tomorrow = new Date();

    tomorrow.setDate(tomorrow.getDate() + 1);

    return {
      startDate: tomorrow,
      endDate: tomorrow
    };
  }

  public static get yesterday(): SkyDateRange {
    const yesterday = new Date();

    yesterday.setDate(yesterday.getDate() - 1);

    return {
      startDate: yesterday,
      endDate: yesterday
    };
  }

  /**
   * A date range starting with the nearest past Sunday and ending with the following Saturday.
   */
  public static get thisWeek(): SkyDateRange {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - startDate.getDay());

    const endDate = new Date();
    endDate.setDate(endDate.getDate() - endDate.getDay() + 6);

    return {
      startDate,
      endDate
    };
  }

  /**
   * A date range starting with the nearest upcoming Sunday and ending with the following Saturday.
   */
  public static get nextWeek(): SkyDateRange {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - startDate.getDay() + 7);

    const endDate = new Date();
    endDate.setDate(endDate.getDate() - endDate.getDay() + 13);

    return {
      startDate,
      endDate
    };
  }

  public static get lastWeek(): SkyDateRange {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - startDate.getDay() - 7);

    const endDate = new Date();
    endDate.setDate(endDate.getDate() - endDate.getDay() - 1);

    return {
      startDate,
      endDate
    };
  }

  public static get thisMonth(): SkyDateRange {
    const startDate = new Date();
    startDate.setDate(1);

    const endDate = new Date();
    endDate.setMonth(endDate.getMonth() + 1);
    endDate.setDate(0);

    return {
      startDate,
      endDate
    };
  }

  public static get nextMonth(): SkyDateRange {
    const startDate = new Date();
    startDate.setDate(1);
    startDate.setMonth(startDate.getMonth() + 1);

    const endDate = new Date();
    endDate.setDate(1);
    endDate.setMonth(endDate.getMonth() + 2);
    endDate.setDate(0);

    return {
      startDate,
      endDate
    };
  }

  public static get lastMonth(): SkyDateRange {
    const startDate = new Date();

    // First, set the day of the month to zero,
    // which points to the last day of the previous month.
    startDate.setDate(0);

    // Finally, set the day of the month to 1.
    startDate.setDate(1);

    const endDate = new Date();
    endDate.setDate(0);

    return {
      startDate,
      endDate
    };
  }

  public static get thisQuarter(): SkyDateRange {
    const startDate = new Date();
    const endDate = new Date();

    const currentMonth = startDate.getMonth();
    const quarterStartMonth = SkyDateRangeRelativeValue.getQuarterStartMonth(currentMonth);

    startDate.setMonth(quarterStartMonth);
    startDate.setDate(1);

    endDate.setMonth(quarterStartMonth + 3);
    endDate.setDate(0);

    return {
      startDate,
      endDate
    };
  }

  public static get nextQuarter(): SkyDateRange {
    const startDate = new Date();
    const endDate = new Date();

    const currentMonth = startDate.getMonth();
    const quarterStartMonth = SkyDateRangeRelativeValue.getQuarterStartMonth(currentMonth);

    startDate.setMonth(quarterStartMonth + 3);
    startDate.setDate(1);

    endDate.setMonth(quarterStartMonth + 6);
    endDate.setDate(0);

    return {
      startDate,
      endDate
    };
  }

  public static get lastQuarter(): SkyDateRange {
    const startDate = new Date();
    startDate.setDate(1);

    const endDate = new Date();
    endDate.setDate(1);

    const currentMonth = startDate.getMonth();
    const quarterStartMonth = SkyDateRangeRelativeValue.getQuarterStartMonth(currentMonth);

    startDate.setMonth(quarterStartMonth - 3);
    startDate.setDate(1);

    endDate.setMonth(quarterStartMonth);
    endDate.setDate(0);

    return {
      startDate,
      endDate
    };
  }

  public static get thisCalendarYear(): SkyDateRange {
    const startDate = new Date();
    startDate.setDate(1);
    startDate.setMonth(0);

    const endDate = new Date();
    endDate.setDate(1);
    endDate.setMonth(0);
    endDate.setFullYear(endDate.getFullYear() + 1);
    endDate.setDate(0);

    return {
      startDate,
      endDate
    };
  }

  public static get nextCalendarYear(): SkyDateRange {
    const startDate = new Date();
    startDate.setDate(1);
    startDate.setMonth(0);
    startDate.setFullYear(startDate.getFullYear() + 1);

    const endDate = new Date();
    endDate.setDate(1);
    endDate.setMonth(0);
    endDate.setFullYear(startDate.getFullYear() + 1);
    endDate.setDate(0);

    return {
      startDate,
      endDate
    };
  }

  public static get lastCalendarYear(): SkyDateRange {
    const startDate = new Date();
    startDate.setDate(1);
    startDate.setMonth(0);
    startDate.setFullYear(startDate.getFullYear() - 1);

    const endDate = new Date();
    endDate.setDate(1);
    endDate.setMonth(0);
    endDate.setDate(0);

    return {
      startDate,
      endDate
    };
  }

  public static get thisFiscalYear(): SkyDateRange {
    const start = new Date();
    start.setDate(1);

    return SkyDateRangeRelativeValue.getClosestFiscalYearRange(start);
  }

  public static get nextFiscalYear(): SkyDateRange {
    const start = new Date();
    start.setDate(1);
    start.setFullYear(start.getFullYear() + 1);

    return SkyDateRangeRelativeValue.getClosestFiscalYearRange(start);
  }

  public static get lastFiscalYear(): SkyDateRange {
    const start = new Date();
    start.setDate(1);
    start.setFullYear(start.getFullYear() - 1);

    return SkyDateRangeRelativeValue.getClosestFiscalYearRange(start);
  }

  private static getQuarterStartMonth(currentMonth: number): number {
    let month: number;
    if (currentMonth < 3) {
      month = 0;
    } else if (currentMonth < 6) {
      month = 3;
    } else if (currentMonth < 9) {
      month = 6;
    } else {
      month = 9;
    }

    return month;
  }

  /**
   * Return a fiscal year based on a start date.
   * (The fiscal year starts in October and continues through to next September.)
   */
  private static getClosestFiscalYearRange(startDate: Date): SkyDateRange {
    const endDate = new Date(startDate);

    if (startDate.getMonth() >= 9) {
      startDate.setMonth(9);
      endDate.setFullYear(startDate.getFullYear() + 1);
      endDate.setMonth(9);
      endDate.setDate(0);
    } else {
      startDate.setFullYear(startDate.getFullYear() - 1);
      startDate.setMonth(9);
      endDate.setMonth(9);
      endDate.setDate(0);
    }

    return {
      startDate,
      endDate
    };
  }
}
