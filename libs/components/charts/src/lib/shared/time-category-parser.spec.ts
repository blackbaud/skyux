import { parseTimeCategory } from './time-category-parser';

describe('parseTimeCategory', () => {
  it('should read a date-only string as local midnight', () => {
    expect(parseTimeCategory('2026-01-15')).toBe(
      new Date(2026, 0, 15).getTime(),
    );
  });

  it('should read a date and time without an offset as local time', () => {
    expect(parseTimeCategory('2026-01-15T10:30')).toBe(
      new Date(2026, 0, 15, 10, 30).getTime(),
    );
    expect(parseTimeCategory('2026-01-15T10:30:45.123')).toBe(
      new Date(2026, 0, 15, 10, 30, 45, 123).getTime(),
    );
  });

  it('should keep only the milliseconds of a longer fraction of a second', () => {
    expect(parseTimeCategory('2026-07-29T21:57:29.6078572+00:00')).toBe(
      Date.UTC(2026, 6, 29, 21, 57, 29, 607),
    );
  });

  it('should read a date and time with an offset as that instant', () => {
    expect(parseTimeCategory('2026-01-15T10:30:00Z')).toBe(
      Date.UTC(2026, 0, 15, 10, 30),
    );
    expect(parseTimeCategory('2026-01-15T10:30:00+05:00')).toBe(
      Date.UTC(2026, 0, 15, 5, 30),
    );
    expect(parseTimeCategory('2026-01-15T10:30:00-05:00')).toBe(
      Date.UTC(2026, 0, 15, 15, 30),
    );
  });

  for (const value of [
    'Jan 1 26',
    '01/15/2026',
    '2026-1-5',
    '2026-02-30',
    '2026-13-01',
    '2026-01-15T25:00',
    '2026-01-15T10:60',
    '2026-01-15T10:30:60',
    '2026-01-15 10:30',
    '0050-01-15',
    '2026-01-15T10:30:00+24:00',
    '2026-01-15T10:30:00+05:60',
    '2026-01-15T10:30:00+0500',
    '',
  ]) {
    it(`should return NaN for the string "${value}"`, () => {
      expect(parseTimeCategory(value)).toBeNaN();
    });
  }

  it('should return NaN for a number', () => {
    expect(parseTimeCategory(2026)).toBeNaN();
  });
});
