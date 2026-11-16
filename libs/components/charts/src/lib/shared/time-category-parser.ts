const ISO_8601 =
  /^(\d{4})-(\d{2})-(\d{2})(?:T(\d{2}):(\d{2})(?::(\d{2})(?:\.(\d+))?)?(Z|[+-](?:[01]\d|2[0-3]):[0-5]\d)?)?$/;

function parseIsoString(value: string): number {
  const match = ISO_8601.exec(value);

  if (!match) {
    return Number.NaN;
  }

  const [year, month, day, hour, minute, second] = match
    .slice(1, 7)
    .map((part) => Number(part ?? 0));
  const millisecond = Number((match[7] ?? '').slice(0, 3).padEnd(3, '0'));
  const offset = match[8];

  const utc = new Date(
    Date.UTC(year, month - 1, day, hour, minute, second, millisecond),
  );

  // Date rolls out-of-range parts over (February 30 becomes March 2) and
  // reads years 0-99 as 1900-1999, so either reads back differently.
  if (
    utc.getUTCFullYear() !== year ||
    utc.getUTCMonth() !== month - 1 ||
    utc.getUTCDate() !== day ||
    utc.getUTCHours() !== hour ||
    utc.getUTCMinutes() !== minute ||
    utc.getUTCSeconds() !== second
  ) {
    return Number.NaN;
  }

  if (offset === undefined) {
    return new Date(
      year,
      month - 1,
      day,
      hour,
      minute,
      second,
      millisecond,
    ).getTime();
  }

  if (offset === 'Z') {
    return utc.getTime();
  }

  const sign = offset.startsWith('-') ? -1 : 1;
  const [offsetHours, offsetMinutes] = offset.slice(1).split(':').map(Number);

  return utc.getTime() - sign * (offsetHours * 60 + offsetMinutes) * 60_000;
}

/**
 * Reads an ISO 8601 time category as a timestamp. A string without an offset
 * is read in local time.
 * @internal
 */
export function parseTimeCategory(value: string | number): number {
  const time = typeof value === 'string' ? parseIsoString(value) : Number.NaN;

  if (Number.isNaN(time)) {
    throw new Error(
      `The time category "${String(value)}" is not a valid date. Time ` +
        'categories must be ISO 8601 date or date-time strings, such as ' +
        '"2026-01-15" or "2026-01-15T10:30:00Z".',
    );
  }

  return time;
}
