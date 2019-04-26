// The contents of this file are mostly ported from the Angular 4.x intl.ts in order to maintain the
// old behavior of using the `Intl` API for formatting dates rather than having to register every
// supported locale.
// https://github.com/angular/angular/blob/4.4.x/packages/common/src/pipes/intl.ts

type DateFormatterFn = (date: Date, locale: string) => string;

const DATE_FORMATS_SPLIT =
    /((?:[^yMLdHhmsazZEwGjJ']+)|(?:'(?:[^']|'')*')|(?:E+|y+|M+|L+|d+|H+|h+|J+|j+|m+|s+|a|z|Z|G+|w+))(.*)/;

const PATTERN_ALIASES: {[format: string]: DateFormatterFn} = {
  // Keys are quoted so they do not get renamed during closure compilation.
  'yMMMdjms': datePartGetterFactory(combine([
    digitCondition('year', 1),
    nameCondition('month', 3),
    digitCondition('day', 1),
    digitCondition('hour', 1),
    digitCondition('minute', 1),
    digitCondition('second', 1)
  ])),
  'yMdjm': datePartGetterFactory(combine([
    digitCondition('year', 1), digitCondition('month', 1), digitCondition('day', 1),
    digitCondition('hour', 1), digitCondition('minute', 1)
  ])),
  'yMMMMEEEEd': datePartGetterFactory(combine([
    digitCondition('year', 1), nameCondition('month', 4), nameCondition('weekday', 4),
    digitCondition('day', 1)
  ])),
  'yMMMMd': datePartGetterFactory(
      combine([digitCondition('year', 1), nameCondition('month', 4), digitCondition('day', 1)])),
  'yMMMd': datePartGetterFactory(
      combine([digitCondition('year', 1), nameCondition('month', 3), digitCondition('day', 1)])),
  'yMd': datePartGetterFactory(
      combine([digitCondition('year', 1), digitCondition('month', 1), digitCondition('day', 1)])),
  'jms': datePartGetterFactory(combine(
      [digitCondition('hour', 1), digitCondition('second', 1), digitCondition('minute', 1)])),
  'jm': datePartGetterFactory(combine([digitCondition('hour', 1), digitCondition('minute', 1)]))
};

const DATE_FORMATS: {[format: string]: DateFormatterFn} = {
  // Keys are quoted so they do not get renamed.
  'yyyy': datePartGetterFactory(digitCondition('year', 4)),
  'yy': datePartGetterFactory(digitCondition('year', 2)),
  'y': datePartGetterFactory(digitCondition('year', 1)),
  'MMMM': datePartGetterFactory(nameCondition('month', 4)),
  'MMM': datePartGetterFactory(nameCondition('month', 3)),
  'MM': datePartGetterFactory(digitCondition('month', 2)),
  'M': datePartGetterFactory(digitCondition('month', 1)),
  'LLLL': datePartGetterFactory(nameCondition('month', 4)),
  'L': datePartGetterFactory(nameCondition('month', 1)),
  'dd': datePartGetterFactory(digitCondition('day', 2)),
  'd': datePartGetterFactory(digitCondition('day', 1)),
  'HH': digitModifier(
      hourExtractor(datePartGetterFactory(hour12Modify(digitCondition('hour', 2), false)))),
  'H': hourExtractor(datePartGetterFactory(hour12Modify(digitCondition('hour', 1), false))),
  'hh': digitModifier(
      hourExtractor(datePartGetterFactory(hour12Modify(digitCondition('hour', 2), true)))),
  'h': hourExtractor(datePartGetterFactory(hour12Modify(digitCondition('hour', 1), true))),
  'jj': datePartGetterFactory(digitCondition('hour', 2)),
  'j': datePartGetterFactory(digitCondition('hour', 1)),
  'mm': digitModifier(datePartGetterFactory(digitCondition('minute', 2))),
  'm': datePartGetterFactory(digitCondition('minute', 1)),
  'ss': digitModifier(datePartGetterFactory(digitCondition('second', 2))),
  's': datePartGetterFactory(digitCondition('second', 1)),
  // while ISO 8601 requires fractions to be prefixed with `.` or `,`
  // we can be just safely rely on using `sss` since we currently don't support single or two digit
  // fractions
  'sss': datePartGetterFactory(digitCondition('second', 3)),
  'EEEE': datePartGetterFactory(nameCondition('weekday', 4)),
  'EEE': datePartGetterFactory(nameCondition('weekday', 3)),
  'EE': datePartGetterFactory(nameCondition('weekday', 2)),
  'E': datePartGetterFactory(nameCondition('weekday', 1)),
  'a': hourClockExtractor(datePartGetterFactory(hour12Modify(digitCondition('hour', 1), true))),
  'Z': timeZoneGetter('short'),
  'z': timeZoneGetter('long'),
  'ww': datePartGetterFactory({}),  // Week of year, padded (00-53). Week 01 is the week with the
                                    // first Thursday of the year. not support ?
  'w':
      datePartGetterFactory({}),  // Week of year (0-53). Week 1 is the week with the first Thursday
                                  // of the year not support ?
  'G': datePartGetterFactory(nameCondition('era', 1)),
  'GG': datePartGetterFactory(nameCondition('era', 2)),
  'GGG': datePartGetterFactory(nameCondition('era', 3)),
  'GGGG': datePartGetterFactory(nameCondition('era', 4))
};

function digitModifier(inner: DateFormatterFn): DateFormatterFn {
  return function(date: Date, locale: string): string {
    const result = inner(date, locale);
    return result.length === 1 ? '0' + result : result;
  };
}

function hourClockExtractor(inner: DateFormatterFn): DateFormatterFn {
  return function(date: Date, locale: string): string { return inner(date, locale).split(' ')[1]; };
}

function hourExtractor(inner: DateFormatterFn): DateFormatterFn {
  return function(date: Date, locale: string): string { return inner(date, locale).split(' ')[0]; };
}

function intlDateFormat(date: Date, locale: string, options: Intl.DateTimeFormatOptions): string {
  return new Intl.DateTimeFormat(locale, options).format(date).replace(/[\u200e\u200f]/g, '');
}

function timeZoneGetter(timezone: string): DateFormatterFn {
  // To workaround `Intl` API restriction for single timezone let format with 24 hours
  const options = {hour: '2-digit', hour12: false, timeZoneName: timezone};
  return function(date: Date, locale: string): string {
    const result = intlDateFormat(date, locale, options);
    // Then extract first 3 letters that related to hours
    /* istanbul ignore else */
    if (result) {
      return result.substring(3);
    }

    /* istanbul ignore next */
    return '';
  };
}

function hour12Modify(
  options: Intl.DateTimeFormatOptions,
  value: boolean
): Intl.DateTimeFormatOptions {
  options.hour12 = value;
  return options;
}

function digitCondition(prop: string, len: number): Intl.DateTimeFormatOptions {
  const result: {[k: string]: string} = {};

  result[prop] = len === 2 ? '2-digit' : 'numeric';

  return result;
}

function nameCondition(prop: string, len: number): Intl.DateTimeFormatOptions {
  const result: {[k: string]: string} = {};
  if (len < 4) {
    result[prop] = len > 1 ? 'short' : 'narrow';
  } else {
    result[prop] = 'long';
  }

  return result;
}

function combine(options: Intl.DateTimeFormatOptions[]): Intl.DateTimeFormatOptions {
  return options.reduce((merged, opt) => ({...merged, ...opt}), {});
}

function datePartGetterFactory(ret: Intl.DateTimeFormatOptions): DateFormatterFn {
  return (date: Date, locale: string): string => intlDateFormat(date, locale, ret);
}

const DATE_FORMATTER_CACHE = new Map<string, string[]>();

function partToTime(part: string): string {
  return part === '\'\'' ? '\'' : part.replace(/(^'|'$)/g, '').replace(/''/g, '\'');
}

export function dateFormatter(format: string, date: Date, locale: string): string {
  const fn = PATTERN_ALIASES[format];

  if (fn) {
    return fn(date, locale);
  }

  const cacheKey = format;
  let parts = DATE_FORMATTER_CACHE.get(cacheKey);

  /* istanbul ignore else */
  if (!parts) {
    parts = [];
    let match: RegExpExecArray|null;
    DATE_FORMATS_SPLIT.exec(format);

    let _format: string|null = format;
    while (_format) {
      match = DATE_FORMATS_SPLIT.exec(_format);
      /*istanbul ignore else */
      if (match) {
        parts = parts.concat(match.slice(1));
        _format = parts.pop() !;
      } else {
        parts.push(_format);
        _format = undefined;
      }
    }

    DATE_FORMATTER_CACHE.set(cacheKey, parts);
  }

  return parts.reduce((text, part) => {
    const dateFormatFn = DATE_FORMATS[part];
    return text + (dateFormatFn ? dateFormatFn(date, locale) : partToTime(part));
  }, '');
}
