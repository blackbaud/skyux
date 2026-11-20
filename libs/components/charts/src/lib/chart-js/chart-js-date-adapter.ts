import { _adapters, type TimeUnit } from 'chart.js';

import { parseTimeCategory } from '../shared/time-category-parser';
import { type SkyChartTimeUnit } from '../shared/time-unit';

/**
 * A time scale's `adapters.date` option.
 * @internal
 */
export interface SkyChartDateAdapterOptions {
  locale: string;
  /**
   * `{0}` is the quarter number and `{1}` is the year.
   */
  quarterLabel: string;
}

const TIME_WITH_SECONDS: Intl.DateTimeFormatOptions = {
  hour: 'numeric',
  minute: '2-digit',
  second: '2-digit',
};

const AXIS_FORMATS: Record<SkyChartTimeUnit, Intl.DateTimeFormatOptions> = {
  millisecond: { ...TIME_WITH_SECONDS, fractionalSecondDigits: 3 },
  second: TIME_WITH_SECONDS,
  minute: { hour: 'numeric', minute: '2-digit' },
  hour: { hour: 'numeric' },
  day: { month: 'short', day: 'numeric' },
  week: { month: 'short', day: 'numeric' },
  month: { month: 'short', year: 'numeric' },
  quarter: { month: 'short', year: 'numeric' },
  year: { year: 'numeric' },
};

const MEDIUM_DATE: Intl.DateTimeFormatOptions = {
  year: 'numeric',
  month: 'short',
  day: 'numeric',
};

const FULL_FORMATS: Record<
  Exclude<SkyChartTimeUnit, 'quarter'>,
  Intl.DateTimeFormatOptions
> = {
  millisecond: { ...MEDIUM_DATE, ...AXIS_FORMATS.millisecond },
  second: { ...MEDIUM_DATE, ...AXIS_FORMATS.second },
  minute: { ...MEDIUM_DATE, ...AXIS_FORMATS.minute },
  hour: { ...MEDIUM_DATE, ...AXIS_FORMATS.minute },
  day: MEDIUM_DATE,
  week: MEDIUM_DATE,
  month: MEDIUM_DATE,
  year: AXIS_FORMATS.year,
};

const FULL_FORMAT_PREFIX = 'full:';

const FIXED_UNIT_MS: Partial<Record<TimeUnit, number>> = {
  millisecond: 1,
  second: 1_000,
  minute: 60_000,
  hour: 3_600_000,
};

/**
 * The adapter format name for a unit's full format.
 * @internal
 */
export function fullTimeFormat(unit: SkyChartTimeUnit): string {
  return FULL_FORMAT_PREFIX + unit;
}

/**
 * Formats a time category as tooltips show it.
 * @internal
 */
export function formatTimeCategory(
  time: number,
  unit: SkyChartTimeUnit,
  locale: string,
  quarterLabel: string,
): string {
  return unit === 'quarter'
    ? formatQuarter(time, locale, quarterLabel)
    : new Intl.DateTimeFormat(locale, FULL_FORMATS[unit]).format(time);
}

// Intl has no quarter format.
function formatQuarter(
  time: number,
  locale: string,
  quarterLabel: string,
): string {
  const date = new Date(time);

  return quarterLabel
    .replace(
      '{0}',
      new Intl.NumberFormat(locale).format(Math.floor(date.getMonth() / 3) + 1),
    )
    .replace(
      '{1}',
      new Intl.DateTimeFormat(locale, { year: 'numeric' }).format(date),
    );
}

function startOf(time: number, unit: TimeUnit): number {
  const date = new Date(time);

  switch (unit) {
    case 'second':
      date.setMilliseconds(0);
      break;
    case 'minute':
      date.setSeconds(0, 0);
      break;
    case 'hour':
      date.setMinutes(0, 0, 0);
      break;
    case 'day':
      date.setHours(0, 0, 0, 0);
      break;
    // The date is set before midnight, which some time zones skip on the day
    // daylight saving time starts.
    case 'week':
      date.setDate(date.getDate() - date.getDay());
      date.setHours(0, 0, 0, 0);
      break;
    case 'month':
      date.setDate(1);
      date.setHours(0, 0, 0, 0);
      break;
    case 'quarter':
      date.setMonth(date.getMonth() - (date.getMonth() % 3), 1);
      date.setHours(0, 0, 0, 0);
      break;
    case 'year':
      date.setMonth(0, 1);
      date.setHours(0, 0, 0, 0);
      break;
  }

  return date.getTime();
}

function add(time: number, amount: number, unit: TimeUnit): number {
  const fixed = FIXED_UNIT_MS[unit];

  if (fixed) {
    return time + amount * fixed;
  }

  // Local date parts keep a day a calendar day across daylight saving changes.
  const date = new Date(time);

  switch (unit) {
    case 'day':
      date.setDate(date.getDate() + amount);
      break;
    case 'week':
      date.setDate(date.getDate() + amount * 7);
      break;
    case 'month':
      date.setMonth(date.getMonth() + amount);
      break;
    case 'quarter':
      date.setMonth(date.getMonth() + amount * 3);
      break;
    case 'year':
      date.setFullYear(date.getFullYear() + amount);
      break;
  }

  return date.getTime();
}

function diff(max: number, min: number, unit: TimeUnit): number {
  const fixed = FIXED_UNIT_MS[unit];

  if (fixed) {
    return Math.trunc((max - min) / fixed);
  }

  const later = new Date(max);
  const earlier = new Date(min);
  const months =
    (later.getFullYear() - earlier.getFullYear()) * 12 +
    later.getMonth() -
    earlier.getMonth();

  switch (unit) {
    case 'day':
      // Rounding absorbs the hour a daylight saving change adds or removes.
      return Math.round(
        (startOf(max, 'day') - startOf(min, 'day')) / 86_400_000,
      );
    case 'week':
      return Math.trunc(diff(max, min, 'day') / 7);
    case 'month':
      return months;
    case 'quarter':
      return Math.trunc(months / 3);
    default:
      return later.getFullYear() - earlier.getFullYear();
  }
}

// Chart.js has no built-in date adapter, so the time scale needs one.
_adapters._date.override({
  formats(): Record<TimeUnit | 'datetime', string> {
    const units = Object.keys(AXIS_FORMATS) as SkyChartTimeUnit[];

    return {
      ...Object.fromEntries(units.map((unit) => [unit, unit])),
      ...Object.fromEntries(
        units.map((unit) => [fullTimeFormat(unit), fullTimeFormat(unit)]),
      ),
      datetime: fullTimeFormat('second'),
    } as Record<TimeUnit | 'datetime', string>;
  },
  parse(value: unknown): number | null {
    if (value === null || value === undefined) {
      return null;
    }

    return typeof value === 'number'
      ? value
      : parseTimeCategory(value as string);
  },
  format(time: number, format: string): string {
    const { locale, quarterLabel } = this.options as SkyChartDateAdapterOptions;

    if (format.startsWith(FULL_FORMAT_PREFIX)) {
      return formatTimeCategory(
        time,
        format.slice(FULL_FORMAT_PREFIX.length) as SkyChartTimeUnit,
        locale,
        quarterLabel,
      );
    }

    if (format === 'quarter') {
      return formatQuarter(time, locale, quarterLabel);
    }

    return new Intl.DateTimeFormat(
      locale,
      AXIS_FORMATS[format as SkyChartTimeUnit],
    ).format(time);
  },
  add,
  diff,
  startOf,
  endOf(time: number, unit: TimeUnit): number {
    return add(startOf(time, unit), 1, unit) - 1;
  },
});
