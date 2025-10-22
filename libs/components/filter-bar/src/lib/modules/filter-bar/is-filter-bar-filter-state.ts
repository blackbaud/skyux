import { SkyFilterBarFilterState } from './models/filter-bar-filter-state';

/**
 * Whether the unknown value is of type SkyFilterBarFilterState.
 */
export function isSkyFilterBarFilterState(
  value: unknown,
): value is SkyFilterBarFilterState {
  return !!(
    value &&
    typeof value === 'object' &&
    'appliedFilters' in value &&
    'selectedFilterIds' in value
  );
}
