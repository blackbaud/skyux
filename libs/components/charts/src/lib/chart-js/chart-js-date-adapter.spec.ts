import { type TimeUnit } from 'chart.js';

import {
  SkyChartDateAdapter,
  formatTimeCategory,
} from './chart-js-date-adapter';

describe('Chart.js date adapter', () => {
  const time = new Date(2026, 0, 15, 10, 30, 45, 123).getTime();

  function createAdapter(locale = 'en-US'): SkyChartDateAdapter {
    return new SkyChartDateAdapter({ locale });
  }

  // Intl separates some parts with narrow or non-breaking spaces.
  function normalize(text: string): string {
    return text.replace(/\s/g, ' ');
  }

  function local(...parts: number[]): number {
    const [year, month, day = 1, hour = 0, minute = 0, second = 0, ms = 0] =
      parts;

    return new Date(year, month, day, hour, minute, second, ms).getTime();
  }

  it('should format each unit for its axis labels', () => {
    const adapter = createAdapter();
    const formats = adapter.formats();
    const labels = Object.fromEntries(
      (
        [
          'millisecond',
          'second',
          'minute',
          'hour',
          'day',
          'week',
          'month',
          'year',
        ] as TimeUnit[]
      ).map((unit) => [unit, normalize(adapter.format(time, formats[unit]))]),
    );

    expect(labels).toEqual({
      millisecond: '10:30:45.123 AM',
      second: '10:30:45 AM',
      minute: '10:30 AM',
      hour: '10 AM',
      day: 'Jan 15',
      week: 'Jan 15',
      month: 'Jan 2026',
      year: '2026',
    });
  });

  it('should format labels for the locale', () => {
    const adapter = createAdapter('fr-CA');

    expect(normalize(adapter.format(time, adapter.formats().month))).toBe(
      'janv. 2026',
    );
  });

  it('should format a full date and time for the tooltip and data table', () => {
    expect(normalize(formatTimeCategory(time, 'day', 'en-US'))).toBe(
      'Jan 15, 2026',
    );
    expect(normalize(formatTimeCategory(time, 'hour', 'en-US'))).toBe(
      'Jan 15, 2026, 10:30 AM',
    );
    expect(normalize(formatTimeCategory(time, 'second', 'en-US'))).toBe(
      'Jan 15, 2026, 10:30:45 AM',
    );
    expect(normalize(formatTimeCategory(time, 'millisecond', 'en-US'))).toBe(
      'Jan 15, 2026, 10:30:45.123 AM',
    );
  });

  it('should format a year for the tooltip and data table as the axis does', () => {
    expect(formatTimeCategory(time, 'year', 'en-US')).toBe('2026');
  });

  it('should parse timestamps and ISO 8601 strings', () => {
    const adapter = createAdapter();

    expect(adapter.parse(time)).toBe(time);
    expect(adapter.parse('2026-01-15')).toBe(local(2026, 0, 15));
    expect(adapter.parse(null)).toBeNull();
    expect(adapter.parse(undefined)).toBeNull();
    expect(adapter.parse('Jan 15 26')).toBeNull();
  });

  it('should find the start of each unit', () => {
    const adapter = createAdapter();

    expect(adapter.startOf(time, 'millisecond')).toBe(time);
    expect(adapter.startOf(time, 'second')).toBe(
      local(2026, 0, 15, 10, 30, 45),
    );
    expect(adapter.startOf(time, 'minute')).toBe(local(2026, 0, 15, 10, 30));
    expect(adapter.startOf(time, 'hour')).toBe(local(2026, 0, 15, 10));
    expect(adapter.startOf(time, 'day')).toBe(local(2026, 0, 15));
    // Weeks start on Sunday.
    expect(adapter.startOf(time, 'week')).toBe(local(2026, 0, 11));
    expect(adapter.startOf(time, 'month')).toBe(local(2026, 0, 1));
    expect(adapter.startOf(time, 'year')).toBe(local(2026, 0, 1));
  });

  it('should find the end of a unit', () => {
    expect(createAdapter().endOf(time, 'month')).toBe(local(2026, 1, 1) - 1);
  });

  it('should add each unit', () => {
    const adapter = createAdapter();

    expect(adapter.add(time, 2, 'millisecond')).toBe(time + 2);
    expect(adapter.add(time, 2, 'second')).toBe(time + 2_000);
    expect(adapter.add(time, 2, 'minute')).toBe(time + 120_000);
    expect(adapter.add(time, 2, 'hour')).toBe(time + 7_200_000);
    expect(adapter.add(time, 2, 'day')).toBe(
      local(2026, 0, 17, 10, 30, 45, 123),
    );
    expect(adapter.add(time, 2, 'week')).toBe(
      local(2026, 0, 29, 10, 30, 45, 123),
    );
    expect(adapter.add(time, 2, 'month')).toBe(
      local(2026, 2, 15, 10, 30, 45, 123),
    );
    expect(adapter.add(time, 2, 'year')).toBe(
      local(2028, 0, 15, 10, 30, 45, 123),
    );
  });

  it('should keep calendar days when adding across a daylight saving change', () => {
    // US daylight saving time starts on March 8, 2026.
    expect(createAdapter().add(local(2026, 2, 7), 2, 'day')).toBe(
      local(2026, 2, 9),
    );
  });

  it('should count whole units between two times', () => {
    const adapter = createAdapter();
    const later = local(2027, 3, 20, 12, 0, 0, 0);

    expect(adapter.diff(time + 1_500, time, 'millisecond')).toBe(1_500);
    expect(adapter.diff(time + 1_500, time, 'second')).toBe(1);
    expect(adapter.diff(time + 150_000, time, 'minute')).toBe(2);
    expect(adapter.diff(time + 9_000_000, time, 'hour')).toBe(2);
    expect(adapter.diff(local(2026, 0, 25), local(2026, 0, 15), 'day')).toBe(
      10,
    );
    expect(adapter.diff(local(2026, 0, 30), local(2026, 0, 15), 'week')).toBe(
      2,
    );
    expect(adapter.diff(later, time, 'month')).toBe(15);
    expect(adapter.diff(later, time, 'year')).toBe(1);
  });
});
