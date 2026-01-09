import { SkyFilterBarFilterState } from '@skyux/filter-bar';

import { DataManagerDemoRow } from './data';
import { FruitTypeLookupItem } from './example.service';

export function filterItems(
  items: DataManagerDemoRow[],
  filterState: SkyFilterBarFilterState | undefined,
  searchText: string | undefined,
): DataManagerDemoRow[] {
  let filteredItems = items;
  const filters = filterState?.appliedFilters;
  if (filters) {
    const hideOrange = !!filters.find(
      (f) => f.filterId === 'hideOrange' && f.filterValue?.value,
    );
    const fruitTypeFilter = filters.find((f) => f.filterId === 'fruitType');
    const selectedTypes: string[] = Array.isArray(
      fruitTypeFilter?.filterValue?.value,
    )
      ? (fruitTypeFilter.filterValue.value as FruitTypeLookupItem[]).map(
          (v) => v.id,
        )
      : [];

    filteredItems = filteredItems.filter((item) => {
      if (hideOrange && item.color === 'orange') {
        return false;
      }
      return !(selectedTypes.length && !selectedTypes.includes(item.type));
    });
  }

  if (searchText) {
    filteredItems = filteredItems.filter((item: DataManagerDemoRow) => {
      let property: keyof typeof item;

      for (property in item) {
        if (
          Object.prototype.hasOwnProperty.call(item, property) &&
          (property === 'name' || property === 'description')
        ) {
          const propertyText = item[property].toUpperCase();
          if (propertyText.includes(searchText.toUpperCase())) {
            return true;
          }
        }
      }

      return false;
    });
  }

  return filteredItems;
}
