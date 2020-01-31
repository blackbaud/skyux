import {
  TestBed
} from '@angular/core/testing';

import {
  expect
} from '@skyux-sdk/testing';

import {
  SkyFuzzyDateService
} from './fuzzy-date.service';

import {
  SkyFuzzyDate
} from './fuzzy-date';

const moment = require('moment');

describe('SkyFuzzyDateservice', () => {
  let service: SkyFuzzyDateService;
  const defaultDateFormat = 'mm/dd/yyyy';

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        SkyFuzzyDateService
      ]
    });

    service = TestBed.get(SkyFuzzyDateService);
  });

  describe('getFuzzyDateFromSelectedDate', () => {

    it('returns a fuzzy date object when provided a date object and the default date format', () => {
      const expectedMonth = 5;
      const expectedDay = 12;
      const expectedYear = 2017;
      const selectedDate = new Date('5/12/2017');
      const fuzzyDate = service.getFuzzyDateFromSelectedDate(selectedDate, defaultDateFormat);

      expect(fuzzyDate).toEqual({ year: expectedYear, month: expectedMonth, day: expectedDay });
    });

    it('returns a fuzzy date object when provided a date object and a date format excluding year', () => {
      const expectedMonth = 5;
      const expectedDay = 12;
      const selectedDate = new Date('5/12/2017');
      const fuzzyDate = service.getFuzzyDateFromSelectedDate(selectedDate, 'mm/dd');

      expect(fuzzyDate).toEqual({ month: expectedMonth, day: expectedDay });
    });

    it('returns a fuzzy date object when provided a date object and a date format excluding day', () => {
      const expectedMonth = 5;
      const expectedYear = 2017;
      const selectedDate = new Date('5/12/2017');
      const fuzzyDate = service.getFuzzyDateFromSelectedDate(selectedDate, 'mm/yyyy');

      expect(fuzzyDate).toEqual({ year: expectedYear, month: expectedMonth });
    });

    it('returns a fuzzy date object when provided a date object and a date format excluding month', () => {
      // Unlikely scenario, though including to reach 100% coverage
      const expectedDay = 12;
      const expectedYear = 2017;
      const selectedDate = new Date('5/12/2017');
      const fuzzyDate = service.getFuzzyDateFromSelectedDate(selectedDate, 'dd/yyyy');

      expect(fuzzyDate).toEqual({ year: expectedYear, day: expectedDay });
    });

    it('returns an undefined fuzzy date object when provided an undefined date object', () => {
      const fuzzyDate = service.getFuzzyDateFromSelectedDate(undefined, defaultDateFormat);

      expect(fuzzyDate).toBeUndefined();
    });

    it('returns an undefined fuzzy date object when provided an undefined date format', () => {
      const expectedMonth = 5;
      const expectedDay = 12;
      const expectedYear = 2017;
      const selectedDate = new Date(expectedYear, expectedMonth, expectedDay);
      const fuzzyDate = service.getFuzzyDateFromSelectedDate(selectedDate, undefined);

      expect(fuzzyDate).toBeUndefined();
    });
  });

  describe('getFuzzyDateFromDateString', () => {
    it('returns a fuzzy date object when provided with a valid full date string.', () => {
      // arrange
      const expected = { month: 1, day: 29, year: 1990 };
      const stringDate = service.getStringFromFuzzyDate(expected, defaultDateFormat);

      // act
      const actual = service.getFuzzyDateFromString(stringDate, defaultDateFormat);

      // assert
      expect(actual).toEqual(expected);
    });

    it('returns a fuzzy date object when provided with a valid full date string with non-US date format.', () => {
      // arrange
      const expected = { month: 1, day: 29, year: 1990 };
      const dateFormat = 'dd/mm/yyyy';
      const stringDate = service.getStringFromFuzzyDate(expected, dateFormat);

      // act
      const actual = service.getFuzzyDateFromString(stringDate, dateFormat);

      // assert
      expect(actual).toEqual(expected);
    });

    it('returns a fuzzy date object when provided with a valid month year date string.', () => {
      // arrange
      const expected: SkyFuzzyDate = { day: undefined, month: 1, year: 1989 };
      const stringDate = service.getStringFromFuzzyDate(expected, defaultDateFormat);

      // act
      const actual = service.getFuzzyDateFromString(stringDate, defaultDateFormat);

      // assert
      expect(actual).toEqual(expected);
    });

    it('returns a fuzzy date object when provided with a valid year month date string.', () => {
      // arrange
      const expected: SkyFuzzyDate = { day: undefined, month: 1, year: 1989 };
      const dateFormat = 'yyyy/mm';
      const stringDate = service.getStringFromFuzzyDate(expected, dateFormat);

      // act
      const actual = service.getFuzzyDateFromString(stringDate, dateFormat);

      // assert
      expect(actual).toEqual(expected);
    });

    it('returns a fuzzy date object when provided with a valid 2-digit year month date string.', () => {
      // arrange
      const expected: SkyFuzzyDate = { day: undefined, month: 1, year: 1989 };
      const dateFormat = 'yy/mm';
      const stringDate = service.getStringFromFuzzyDate(expected, dateFormat);

      // act
      const actual = service.getFuzzyDateFromString(stringDate, dateFormat);

      // assert
      expect(actual).toEqual(expected);
    });

    it('returns a fuzzy date object when provided with a valid month year date string with non-US date format.', () => {
      // arrange
      const expected: SkyFuzzyDate = { day: undefined, month: 1, year: 1990 };
      const dateFormat = 'dd/mm/yyyy';
      const stringDate = service.getStringFromFuzzyDate(expected, dateFormat);

      // act
      const actual = service.getFuzzyDateFromString(stringDate, dateFormat);

      // assert
      expect(actual).toEqual(expected);
    });

    it('returns a fuzzy date object when provided with a valid month year date string with a 2 digit year dateformat.', () => {
      // arrange
      const expected: SkyFuzzyDate = { day: undefined, month: 1, year: 1989 };
      const dateFormat = 'mm/yy';
      const stringDate = '1/89';

      // act
      const actual = service.getFuzzyDateFromString(stringDate, dateFormat);

      // assert
      expect(actual).toEqual(expected);
    });

    it('returns a fuzzy date object when provided with a valid month day date string.', () => {
      // arrange
      const expected: SkyFuzzyDate = { year: undefined, month: 2, day: 12 };
      const stringDate = service.getStringFromFuzzyDate(expected, defaultDateFormat);

      // act
      const actual = service.getFuzzyDateFromString(stringDate, defaultDateFormat);

      // assert
      expect(actual).toEqual(expected);
    });

    it('returns a fuzzy date object when provided with a valid day month date string.', () => {
      // arrange
      const expected: SkyFuzzyDate = { year: undefined, month: 2, day: 12 };
      const dateFormat = 'dd/mm';
      const stringDate = service.getStringFromFuzzyDate(expected, dateFormat);

      // act
      const actual = service.getFuzzyDateFromString(stringDate, dateFormat);

      // assert
      expect(actual).toEqual(expected);
    });

    it('returns a fuzzy date object when provided with a valid year date string.', () => {
      // arrange
      const expected: SkyFuzzyDate = { year: 2017, month: undefined, day: undefined };
      const dateFormat = 'YYYY';
      const stringDate = service.getStringFromFuzzyDate(expected, dateFormat);

      // act
      const actual = service.getFuzzyDateFromString(stringDate, dateFormat);

      // assert
      expect(actual).toEqual(expected);
    });

    it('returns a fuzzy date object when provided with a valid date using words such as "January".', () => {
      // arrange
      const expected: SkyFuzzyDate = { year: undefined, month: 11, day: 18 };
      const stringDate = 'November 18';

      // act
      const actual = service.getFuzzyDateFromString(stringDate, defaultDateFormat);

      // assert
      expect(actual).toEqual(expected);
    });

    it('returns null if the date provided is not valid.', () => {
      // arrange
      const stringDate = 'fsfsafd';

      // act
      const actual = service.getFuzzyDateFromString(stringDate, defaultDateFormat);

      // assert
      expect(actual).toBeUndefined();
    });

    it('returns a fuzzy date object when provided with a valid leap year date string.', () => {
      // arrange
      const expected = { month: 2, day: 29, year: 2000 };
      const stringDate = service.getStringFromFuzzyDate(expected, defaultDateFormat);

      // act
      const actual = service.getFuzzyDateFromString(stringDate, defaultDateFormat);

      // assert
      expect(actual).toEqual(expected);
    });

    it('returns a fuzzy date object if 2/29 is provided excluding year.', () => {
      // arrange
      const expectedFuzzyDate: SkyFuzzyDate = { month: 2, day: 29, year: undefined };
      const stringDate = service.getStringFromFuzzyDate(expectedFuzzyDate, defaultDateFormat);

      // act
      const actual = service.getFuzzyDateFromString(stringDate, defaultDateFormat);

      // assert
      expect(actual).toEqual(expectedFuzzyDate);
    });

    it('returns null if 2/29 is provided as a full date including a non-leap-year.', () => {
      // arrange
      const stringDate = service.getStringFromFuzzyDate({ month: 2, day: 29, year: 2001 }, defaultDateFormat);

      // act
      const actual = service.getFuzzyDateFromString(stringDate, defaultDateFormat);

      // assert
      expect(actual).toBeUndefined();
    });

    it('returns null if the date provided has more than 3 date components.', () => {
      // arrange
      const stringDate = '01/02/2003/4';

      // act
      const actual = service.getFuzzyDateFromString(stringDate, defaultDateFormat);

      // assert
      expect(actual).toBeUndefined();
    });

    it('returns a fuzzy date object if the date provided includes a string month.', () => {
      // arrange
      const stringDate = 'January 1 2003';
      moment.locale('en');

      // act
      const actual = service.getFuzzyDateFromString(stringDate, defaultDateFormat);

      // assert
      expect(actual).toEqual({ month: 1, day: 1, year: 2003 });
    });

    it('returns null if the date provided includes an invalid string month.', () => {
      // arrange
      const stringDate = 'FakeMonth 1 2003';
      moment.locale('en');

      // act
      const actual = service.getFuzzyDateFromString(stringDate, defaultDateFormat);

      // assert
      expect(actual).toBeUndefined();
    });

    it('returns null if an undefined date format provided.', () => {
      // arrange
      const stringDate = service.getStringFromFuzzyDate({ month: 5, day: 12, year: 2017 }, defaultDateFormat);

      // act
      const actual = service.getFuzzyDateFromString(stringDate, undefined);

      // assert
      expect(actual).toBeUndefined();
    });

    it('returns null if an empty string date format provided.', () => {
      // arrange
      const stringDate = service.getStringFromFuzzyDate({ month: 5, day: 12, year: 2017 }, defaultDateFormat);

      // act
      const actual = service.getFuzzyDateFromString(stringDate, '');

      // assert
      expect(actual).toBeUndefined();
    });
  });

  describe('getDateStringFromFuzzyDate', () => {
    it('returns a valid date string based on the provided fuzzy date', () => {
      // arrange
      const fuzzyDate: SkyFuzzyDate = { month: 2, day: 14, year: 1960 };
      const expected = fuzzyDate.month + '/' + fuzzyDate.day + '/' + fuzzyDate.year;

      // act
      const actual = service.getStringFromFuzzyDate(fuzzyDate, 'mm/dd/yyyy');

      // assert
      expect(actual).toBe(expected);
    });

    it('returns a valid month year date string based on the provided month year fuzzy date', () => {
      // arrange
      const fuzzyDate: SkyFuzzyDate = { month: 2, year: 1960 };
      const expected = fuzzyDate.month + '/' + fuzzyDate.year;

      // act
      const actual = service.getStringFromFuzzyDate(fuzzyDate, 'mm/dd/yyyy');

      // assert
      expect(actual).toBe(expected);
    });

    it('returns a valid month day date string based on the provided month day fuzzy date', () => {
      // arrange
      const fuzzyDate: SkyFuzzyDate = { month: 2, day: 14 };
      const expected = fuzzyDate.month + '/' + fuzzyDate.day;

      // act
      const actual = service.getStringFromFuzzyDate(fuzzyDate, 'mm/dd/yyyy');

      // assert
      expect(actual).toBe(expected);
    });

    it('returns a valid year date string based on the provided year fuzzy date', () => {
      // arrange
      const fuzzyDate: SkyFuzzyDate = { year: 1985 };
      const expected = fuzzyDate.year;

      // act
      const actual = service.getStringFromFuzzyDate(fuzzyDate, 'mm/dd/yyyy');

      // assert
      expect(actual).toBe(expected.toString());
    });
  });

  describe('getMomentFromFuzzyDate', () => {
    it('returns a valid moment object based on the provided fuzzy date', () => {
      // arrange
      const fuzzyDate: SkyFuzzyDate = { month: 11, day: 5, year: 1850 };
      const expected = moment([fuzzyDate.year, fuzzyDate.month - 1, fuzzyDate.day]);

      // act
      const actual = service.getMomentFromFuzzyDate(fuzzyDate);

      // assert
      expect(actual).toEqual(expected);
    });

    it('defaults the year to the current year with fuzzy date\'s not having a year', () => {
      // arrange
      const fuzzyDate: SkyFuzzyDate = { month: 11, day: 5 };
      const currentYear = new Date().getFullYear();
      const expected = moment([currentYear, fuzzyDate.month - 1, fuzzyDate.day]);

      // act
      const actual = service.getMomentFromFuzzyDate(fuzzyDate);

      // assert
      expect(actual).toEqual(expected);
    });

    it('handles non-leap years when year is NOT provided', () => {
      // arrange
      const baseTime = new Date(2017, 1, 28); // Mock date to return a non-leap year.
      jasmine.clock().mockDate(baseTime);
      const fuzzyDate: SkyFuzzyDate = { month: 2, day: 29 };
      const expected = moment([2016, fuzzyDate.month - 1, fuzzyDate.day]);

      // act
      const actual = service.getMomentFromFuzzyDate(fuzzyDate);

      // assert
      expect(actual).toEqual(expected);
    });

    it('handles leap years when year is provided', () => {
      // arrange
      const baseTime = new Date(2016, 1, 29); // Mock date to return a leap year.
      jasmine.clock().mockDate(baseTime);
      const fuzzyDate: SkyFuzzyDate = { month: 2, day: 29 };
      const expected = moment([2016, fuzzyDate.month - 1, fuzzyDate.day]);

      // act
      const actual = service.getMomentFromFuzzyDate(fuzzyDate);

      // assert
      expect(actual).toEqual(expected);
    });

    it('returns a valid moment object based on fuzzy date with 0 month and day', () => {
      // arrange
      const fuzzyDate: SkyFuzzyDate = { month: 0, day: 0, year: 2009 };
      // January 1, 2009
      const expected = moment([fuzzyDate.year, 0, 1 ]);

      // act
      const actual = service.getMomentFromFuzzyDate(fuzzyDate);

      // assert
      expect(actual).toEqual(expected);
    });

    it('returns a valid moment object based on fuzzy date with undefined month and day', () => {
      // arrange
      const fuzzyDate: SkyFuzzyDate = { month: undefined, day: undefined, year: 2009 };
      // January 1, 2009
      const expected = moment([fuzzyDate.year, 0, 1 ]);

      // act
      const actual = service.getMomentFromFuzzyDate(fuzzyDate);

      // assert
      expect(actual).toEqual(expected);
    });
  });

  describe('getFuzzyDateRange', () => {
    it('returns a date range of years, months, and days when provided with 2 full fuzzy dates.', () => {
      // arrange
      const startFuzzyDate: SkyFuzzyDate = { month: 2, day: 14, year: 1960 };
      const endFuzzyDate: SkyFuzzyDate = { month: 4, day: 16, year: 1962 };

      // act
      const actual = service.getFuzzyDateRange(startFuzzyDate, endFuzzyDate);

      // assert
      expect(actual.years).toEqual(2);
      expect(actual.months).toEqual(26);
      expect(actual.days).toEqual(792);
    });

    it('returns a fuzzy date range when provided with partial fuzzy dates.', () => {
      // arrange
      const startFuzzyDate: SkyFuzzyDate = { month: 2, year: 1960 };
      const endFuzzyDate: SkyFuzzyDate = { month: 4, day: 16, year: 1962 };

      // act
      const actual = service.getFuzzyDateRange(startFuzzyDate, endFuzzyDate);

      // assert
      expect(actual.years).toEqual(2);
      expect(actual.months).toEqual(26);
    });

    it('returns empty years, months, days values with valid = false if no years are provided.', () => {
      // arrange
      const startFuzzyDate: SkyFuzzyDate = { month: 2, year: 1960 };
      const endFuzzyDate: SkyFuzzyDate = { month: 4, day: 16 };

      // act
      const actual = service.getFuzzyDateRange(startFuzzyDate, endFuzzyDate);

      // assert
      expect(actual.valid).toBeFalsy();
    });

    it('returns empty years, months, days values with valid = false if the end date is not after the start date.', () => {
      // arrange
      const startFuzzyDate: SkyFuzzyDate = { month: 2, year: 1960 };
      const endFuzzyDate: SkyFuzzyDate = { month: 4, year: 1950 };

      // act
      const actual = service.getFuzzyDateRange(startFuzzyDate, endFuzzyDate);

      // assert
      expect(actual.valid).toBeFalsy();
    });
  });

  describe('getCurrentFuzzyDate', () => {
    it('returns a full fuzzy date that coincides with the date of today.', () => {
      // arrange
      const currentDate = new Date();
      const expected: SkyFuzzyDate = { month: currentDate.getMonth() + 1, day: currentDate.getDate(), year: currentDate.getFullYear() };

      // act
      const actual = service.getCurrentFuzzyDate();

      // assert
      expect(actual).toEqual(expected);
    });
  });
});
