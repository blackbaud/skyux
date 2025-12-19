import { SkyFilterBarFilterItem } from './models/filter-bar-filter-item';

/**
 * Retrieves a typed filter value from an array of filter items.
 * @typeParam TFilters - A record type mapping filter IDs to their value types.
 * @typeParam K - The specific filter ID key.
 * @param filters - The array of filter items to search.
 * @param filterId - The ID of the filter to retrieve.
 * @returns The typed filter value, or `undefined` if not found.
 *
 * @example
 * ```typescript
 * interface MyFilters {
 *   name: string;
 *   salary: number;
 *   active: boolean;
 * }
 *
 * const name = getFilterValue<MyFilters, 'name'>(appliedFilters, 'name');
 * // name is typed as `string | undefined`
 * ```
 */
export function getFilterValue<
  TFilters extends object,
  K extends keyof TFilters & string,
>(
  filters: SkyFilterBarFilterItem[] | undefined,
  filterId: K,
): TFilters[K] | undefined {
  const filter = filters?.find((f) => f.filterId === filterId);
  return filter?.filterValue?.value as TFilters[K] | undefined;
}

/**
 * Checks whether a filter has a defined value.
 * @typeParam TFilters - A record type mapping filter IDs to their value types.
 * @typeParam K - The specific filter ID key.
 * @param filters - The array of filter items to search.
 * @param filterId - The ID of the filter to check.
 * @returns `true` if the filter has a defined value, `false` otherwise.
 */
export function hasFilterValue<
  TFilters extends Record<string, unknown>,
  K extends keyof TFilters & string,
>(filters: SkyFilterBarFilterItem[] | undefined, filterId: K): boolean {
  const value = getFilterValue<TFilters, K>(filters, filterId);
  return value !== undefined && value !== null;
}

/**
 * Creates a typed filter item.
 * @typeParam TValue - The type of the filter value.
 * @param filterId - The unique identifier for the filter.
 * @param value - The filter value.
 * @param displayValue - Optional human-readable display value.
 * @returns A typed filter item.
 */
export function createFilterItem<TValue>(
  filterId: string,
  value: TValue,
  displayValue?: string,
): SkyFilterBarFilterItem<TValue> {
  return {
    filterId,
    filterValue: {
      value,
      displayValue,
    },
  };
}
