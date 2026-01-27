import {
  SkyDataGridNumberRangeFilterValue,
  SkyDataGridSort,
} from '@skyux/data-grid';
import { SkyDateRange } from '@skyux/datetime';
import { SkyFilterStateFilterItem } from '@skyux/lists';

import { Employee } from './data';

export function dataSortAndFilter(
  allEmployees: Employee[],
  appliedFilters: SkyFilterStateFilterItem<
    string | SkyDataGridNumberRangeFilterValue | SkyDateRange | boolean
  >[],
  sort: SkyDataGridSort | undefined,
  searchText: string,
): Employee[] {
  const normalSearch = searchText.normalize().toLowerCase();
  const records = allEmployees.filter((employee: Employee) => {
    let includeEmployee = true;
    if (searchText) {
      includeEmployee &&= Object.values(employee).some((value) =>
        String(value ?? '')
          .normalize()
          .toLowerCase()
          .includes(normalSearch),
      );
    }
    for (const filterItem of appliedFilters) {
      switch (filterItem.filterId) {
        case 'name':
          includeEmployee &&= filterByName(
            filterItem as SkyFilterStateFilterItem<string>,
            employee,
          );
          break;
        case 'salary':
          includeEmployee &&= filterBySalary(
            filterItem as SkyFilterStateFilterItem<SkyDataGridNumberRangeFilterValue>,
            employee,
          );
          break;
        case 'startDate':
          includeEmployee &&= filterByDate(
            filterItem as SkyFilterStateFilterItem<SkyDateRange>,
            employee,
          );
          break;
        case 'hideInactive':
          includeEmployee &&= filterByActive(
            filterItem as SkyFilterStateFilterItem<boolean>,
            employee,
          );
          break;
        default:
      }
    }
    return includeEmployee;
  });
  if (sort) {
    switch (sort.fieldSelector) {
      case 'name':
        records.sort(
          (a, b) => a.name.localeCompare(b.name) * (sort.descending ? -1 : 1),
        );
        break;
      case 'salary':
        records.sort(
          (a, b) => (a.salary - b.salary) * (sort.descending ? -1 : 1),
        );
        break;
      case 'startDate':
        records.sort(
          (a, b) =>
            (new Date(a.startDate).getTime() -
              new Date(b.startDate).getTime()) *
            (sort.descending ? -1 : 1),
        );
        break;
      case 'active':
        records.sort(
          (a, b) =>
            (Number(a.active) - Number(b.active)) * (sort.descending ? -1 : 1),
        );
        break;
      default:
    }
  }
  return records;
}

function filterByName(
  filterItem: SkyFilterStateFilterItem<string>,
  employee: Employee,
): boolean {
  return (
    !filterItem.filterValue?.value ||
    employee.name
      .normalize()
      .toLowerCase()
      .includes(filterItem.filterValue.value.normalize().toLowerCase())
  );
}

function filterBySalary(
  filterItem: SkyFilterStateFilterItem<SkyDataGridNumberRangeFilterValue>,
  employee: Employee,
): boolean {
  const filterValue: SkyDataGridNumberRangeFilterValue | undefined =
    filterItem.filterValue?.value;
  return (
    !filterValue ||
    ((Number.isNaN(Number(filterValue.from ?? undefined)) ||
      employee.salary >= Number(filterValue.from)) &&
      (Number.isNaN(Number(filterValue.to ?? undefined)) ||
        employee.salary <= Number(filterValue.to)))
  );
}

function filterByDate(
  filterItem: SkyFilterStateFilterItem<SkyDateRange>,
  employee: Employee,
): boolean {
  const filterValue: SkyDateRange | undefined = filterItem.filterValue?.value;
  // This is simplistic and does not account for time zones.
  return (
    !filterValue ||
    ((!filterValue.startDate ||
      new Date(employee.startDate) >= filterValue.startDate) &&
      (!filterValue.endDate ||
        new Date(employee.startDate) <= filterValue.endDate))
  );
}

function filterByActive(
  filterItem: SkyFilterStateFilterItem<boolean>,
  employee: Employee,
): boolean {
  return !filterItem.filterValue?.value || employee.active;
}
