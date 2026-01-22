import { SkyLogService } from '@skyux/core';
import { SkyDateRange } from '@skyux/datetime';
import { SkyFilterStateFilterItem } from '@skyux/lists';

import { SkyDataGridFilterOperator } from '../types/data-grid-filter-operator';
import { SkyDataGridNumberRangeFilterValue } from '../types/data-grid-number-range-filter-value';

/**
 * @internal
 */
export function doesFilterPass<
  T extends { id: string } = { id: string } & Record<string, unknown>,
>(
  filterItems: SkyFilterStateFilterItem<
    T[keyof T] extends string ? string | string[] : T[keyof T] | string
  >[],
  data: Partial<T>,
  columns: readonly {
    filterId: string | undefined;
    field: keyof T | undefined;
    filterOperator: SkyDataGridFilterOperator | undefined;
    type: 'text' | 'number' | 'date' | 'boolean';
  }[],
  logger: SkyLogService,
): boolean {
  return filterItems.every((filterItem) =>
    doesSingleFilterPass(filterItem, data, columns, logger),
  );
}

function doesSingleFilterPass<
  T extends { id: string } = { id: string } & Record<string, unknown>,
>(
  filter: SkyFilterStateFilterItem<
    T[keyof T] extends string ? string | string[] : T[keyof T] | string
  >,
  data: Partial<T>,
  columns: readonly {
    filterId: string | undefined;
    field: keyof T | undefined;
    filterOperator: SkyDataGridFilterOperator | undefined;
    type: 'text' | 'number' | 'date' | 'boolean';
  }[],
  logger: SkyLogService,
): boolean {
  // Find column with matching filterId
  let column = columns.find((col) => col.filterId === filter.filterId);
  column ??= columns.find((col) => col.field === filter.filterId);
  if (!column || filter.filterValue?.value === undefined) {
    return true;
  }

  const rowValue =
    column.field && data && column.field in data
      ? data[column.field as keyof T]
      : undefined;
  const filterValue = filter.filterValue.value;
  const filterOperator = column.filterOperator;

  switch (column.type) {
    case 'text':
      return doesTextFilterPass(
        filterOperator ?? 'contains',
        filterValue,
        String(rowValue ?? ''),
        logger,
      );
    case 'number':
      return doesNumericFilterPass(
        filterValue as string | number | SkyDataGridNumberRangeFilterValue,
        rowValue as string | number,
        filterOperator,
        logger,
      );
    case 'date':
      return doesDateFilterPass(
        filterValue as SkyDateRange | Date | string,
        rowValue as Date | string,
        filterOperator,
        logger,
      );
    case 'boolean':
      return doesBooleanFilterPass(
        filterValue,
        rowValue,
        filterOperator,
        logger,
      );
  }
}

function doesBooleanFilterPass(
  filterValue: unknown,
  rowValue: unknown,
  filterOperator: SkyDataGridFilterOperator | undefined,
  logger: SkyLogService,
): boolean {
  if (
    filterOperator === 'notEqual' &&
    Boolean(rowValue) === Boolean(filterValue)
  ) {
    return false;
  } else if (
    (filterOperator ?? 'equals') === 'equals' &&
    Boolean(rowValue) !== Boolean(filterValue)
  ) {
    return false;
  } else if (
    filterOperator &&
    !['equals', 'notEqual'].includes(filterOperator)
  ) {
    logger.warn(`Unsupported boolean filter operator: ${filterOperator}`);
  }
  return true;
}

function doesDateFilterPass(
  filterValue: SkyDateRange | Date | string,
  rowValue: Date | string,
  filterOperator: SkyDataGridFilterOperator | undefined,
  logger: SkyLogService,
): boolean {
  const rowDate = asDate(rowValue);
  if (isDateRangeFilter(filterValue)) {
    const range = filterValue as SkyDateRange;
    return !(
      (range.startDate && zeroHour(rowDate) < zeroHour(range.startDate)) ||
      (range.endDate && zeroHour(rowDate) > zeroHour(range.endDate))
    );
  } else {
    const filterDate = asDate(filterValue);
    return numericFilter(
      filterOperator ?? 'equals',
      zeroHour(filterDate),
      zeroHour(rowDate),
      logger,
    );
  }
}

/**
 * Date object at UTC midnight.
 */
function asDate(value: Date | string): Date {
  const date =
    value instanceof Date ? new Date(value) : new Date(value as string);
  date.setHours(
    date.getHours() + Math.floor(date.getTimezoneOffset() / 60),
    date.getMinutes() + (date.getTimezoneOffset() % 60),
  );
  date.setTime(zeroHour(date));
  return date;
}

/**
 * Timestamp at UTC midnight.
 */
function zeroHour(value: Date): number {
  return Date.UTC(value.getFullYear(), value.getMonth(), value.getDate());
}

function doesNumericFilterPass(
  filterValue: SkyDataGridNumberRangeFilterValue | string | number,
  rowValue: string | number,
  filterOperator: SkyDataGridFilterOperator | undefined,
  logger: SkyLogService,
): boolean {
  if (isNumberRangeFilter(filterValue)) {
    if (
      typeof (filterValue.from ?? undefined) !== 'undefined' &&
      Number(rowValue) < Number(filterValue.from)
    ) {
      // If the low end is defined and the value is less than the low end.
      return false;
    }
    if (
      typeof (filterValue.to ?? undefined) !== 'undefined' &&
      Number(rowValue) > Number(filterValue.to)
    ) {
      // If the high end is defined and the value is greater than the high end.
      return false;
    }
  } else {
    return numericFilter(
      filterOperator ?? 'equals',
      Number(filterValue),
      Number(rowValue),
      logger,
    );
  }
  return true;
}

/**
 * Ensures the provided value matches the number range filter shape. It must have a `from` and `to` property,
 * with at least one being a number (both can be numbers).
 */
function isNumberRangeFilter(
  value: unknown,
): value is SkyDataGridNumberRangeFilterValue {
  return (
    typeof value === 'object' &&
    value !== null &&
    'from' in value &&
    'to' in value &&
    (typeof (value as SkyDataGridNumberRangeFilterValue).from === 'number' ||
      typeof (value as SkyDataGridNumberRangeFilterValue).to === 'number') &&
    (typeof (value as SkyDataGridNumberRangeFilterValue).from === 'number' ||
      value.from === null) &&
    (typeof (value as SkyDataGridNumberRangeFilterValue).to === 'number' ||
      value.to === null)
  );
}

/**
 * Ensures the provided value matches the date range filter shape. It must have a `startDate` and/or `endDate` property,
 * with at least one being a Date object.
 */
function isDateRangeFilter(value: unknown): value is SkyDateRange {
  return (
    typeof value === 'object' &&
    value !== null &&
    ('startDate' in value || 'endDate' in value) &&
    ((value as SkyDateRange).startDate instanceof Date ||
      (value as SkyDateRange).endDate instanceof Date)
  );
}

function doesTextFilterPass(
  filterOperator: SkyDataGridFilterOperator,
  filterValue: unknown,
  rowValue: string,
  logger: SkyLogService,
): boolean {
  const rowString = rowValue.normalize().toLocaleLowerCase();
  const filterArray: string[] = (
    Array.isArray(filterValue) ? filterValue : [filterValue]
  ).map((value) => String(value).normalize().toLocaleLowerCase());

  switch (filterOperator) {
    case 'equals':
      return filterArray.some((value) => value === rowString);
    case 'notEqual':
      return filterArray.every((value) => value !== rowString);
    case 'contains':
      return filterArray.some((value) => rowString.includes(value));
    case 'notContains':
      return filterArray.every((value) => !rowString.includes(value));
    case 'startsWith':
      return filterArray.some((value) => rowString.startsWith(value));
    case 'endsWith':
      return filterArray.some((value) => rowString.endsWith(value));
    default:
      logger.warn(`Unsupported text filter operator: ${filterOperator}`);
      return true;
  }
}

function numericFilter(
  filterOperator: SkyDataGridFilterOperator,
  filterValue: number,
  rowValue: number,
  logger: SkyLogService,
): boolean {
  switch (filterOperator) {
    case 'equals':
      return rowValue === filterValue;
    case 'notEqual':
      return rowValue !== filterValue;
    case 'lessThan':
      return rowValue < filterValue;
    case 'lessThanOrEqual':
      return rowValue <= filterValue;
    case 'greaterThan':
      return rowValue > filterValue;
    case 'greaterThanOrEqual':
      return rowValue >= filterValue;
    default:
      logger.warn(
        `Unsupported number or date filter operator: ${filterOperator}`,
      );
      return true;
  }
}
