import {
  SkyDataGridNumberRangeFilterValue,
  SkyDataGridPageRequest,
} from '@skyux/data-grid';
import { SkyDataManagerState } from '@skyux/data-manager';
import { SkyDateRange } from '@skyux/datetime';
import { SkyFilterState, SkyFilterStateFilterItem } from '@skyux/lists';

import { Observable, delay, of } from 'rxjs';

import { dataSortAndFilter } from './data-sort-and-filter';

export interface Employee {
  id: string;
  name: string;
  department: string;
  salary: number;
  startDate: string;
  active: boolean;
}

const employees = [
  {
    id: '1',
    name: 'Alice Johnson',
    department: 'Engineering',
    salary: 95000,
    startDate: '2020-03-15',
    active: true,
  },
  {
    id: '2',
    name: 'Bob Smith',
    department: 'Sales',
    salary: 72000,
    startDate: '2019-07-22',
    active: true,
  },
  {
    id: '3',
    name: 'Carol Williams',
    department: 'Engineering',
    salary: 110000,
    startDate: '2018-01-10',
    active: true,
  },
  {
    id: '4',
    name: 'David Brown',
    department: 'Marketing',
    salary: 65000,
    startDate: '2021-09-01',
    active: false,
  },
  {
    id: '5',
    name: 'Eva Martinez',
    department: 'Engineering',
    salary: 88000,
    startDate: '2020-11-30',
    active: true,
  },
  {
    id: '6',
    name: 'Frank Garcia',
    department: 'Sales',
    salary: 78000,
    startDate: '2017-04-18',
    active: true,
  },
  {
    id: '7',
    name: 'Grace Lee',
    department: 'Marketing',
    salary: 71000,
    startDate: '2022-02-14',
    active: true,
  },
  {
    id: '8',
    name: 'Henry Wilson',
    department: 'Engineering',
    salary: 125000,
    startDate: '2016-08-05',
    active: false,
  },
  {
    id: '9',
    name: 'Ivy Chen',
    department: 'Sales',
    salary: 82000,
    startDate: '2019-12-20',
    active: true,
  },
  {
    id: '10',
    name: 'Jack Taylor',
    department: 'Marketing',
    salary: 58000,
    startDate: '2023-01-09',
    active: true,
  },
];

export function remoteService(params: {
  dataManagerUpdates: SkyDataManagerState | undefined;
  pageRequest: SkyDataGridPageRequest | undefined;
}): Observable<{ data: Employee[] | null; count: number } | null> {
  if (params.pageRequest?.pageSize) {
    const pageNumber = params.pageRequest.pageNumber;
    const pageSize = params.pageRequest.pageSize;
    const data = dataSortAndFilter(
      employees,
      ((
        params.dataManagerUpdates?.filterData?.filters as
          | SkyFilterState
          | undefined
      )?.appliedFilters ?? []) as SkyFilterStateFilterItem<
        string | SkyDataGridNumberRangeFilterValue | SkyDateRange | boolean
      >[],
      params.dataManagerUpdates?.activeSortOption,
      params.dataManagerUpdates?.searchText ?? '',
    );
    return of({
      data: data.slice((pageNumber - 1) * pageSize, pageNumber * pageSize),
      count: data.length,
    }).pipe(delay(800));
  }
  return of(null).pipe(delay(800));
}
