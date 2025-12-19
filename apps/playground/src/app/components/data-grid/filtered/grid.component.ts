import { JsonPipe } from '@angular/common';
import { Component, computed, signal } from '@angular/core';
import { SkyAgGridColumnComponent, SkyAgGridComponent } from '@skyux/ag-grid';
import { SkyDateRangeCalculation } from '@skyux/datetime';
import {
  SkyFilterBarFilterItem,
  SkyFilterBarFilterState,
  SkyFilterBarModule,
  getFilterValue,
} from '@skyux/filter-bar';

import { HideInactiveFilterModalComponent } from './hide-inactive-filter-modal.component';
import { NameFilterModalComponent } from './name-filter-modal.component';
import { SalaryFilterModalComponent } from './salary-filter-modal.component';
import { StartDateFilterModalComponent } from './start-date-filter-modal.component';

/**
 * Define the shape of filter values for type-safe access.
 */
interface EmployeeFilters {
  name: string;
  salary: { from: number; to: number };
  hideInactive: boolean;
  startDate: SkyDateRangeCalculation;
}

interface Employee {
  id: string;
  name: string;
  department: string;
  salary: number;
  startDate: string;
  active: boolean;
}

@Component({
  selector: 'app-filtered-grid',
  imports: [
    JsonPipe,
    SkyAgGridComponent,
    SkyAgGridColumnComponent,
    SkyFilterBarModule,
  ],
  templateUrl: './grid.component.html',
  styleUrl: './grid.component.scss',
})
export default class FilteredGridComponent {
  protected readonly nameFilterModal = NameFilterModalComponent;
  protected readonly salaryFilterModal = SalaryFilterModalComponent;
  protected readonly hideInactiveModal = HideInactiveFilterModalComponent;
  protected readonly startDateFilterModal = StartDateFilterModalComponent;

  protected readonly appliedFilters = signal<SkyFilterBarFilterItem[]>([]);

  protected readonly filterState = computed<SkyFilterBarFilterState>(() => ({
    appliedFilters: this.appliedFilters(),
  }));

  /**
   * Raw employee data before filtering.
   */
  protected readonly allEmployees: Employee[] = [
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

  /**
   * Filtered employee data - applies boolean and date range filters that AG Grid doesn't handle.
   * Text and number filters are handled by AG Grid's setFilterModel.
   */
  protected readonly employees = computed<Employee[]>(() => {
    const filters = this.appliedFilters();
    let result = this.allEmployees;

    // Boolean filters are handled externally since AG Grid doesn't have a built-in boolean filter
    const hideInactive = getFilterValue<EmployeeFilters, 'hideInactive'>(
      filters,
      'hideInactive',
    );
    if (hideInactive) {
      result = result.filter((emp) => emp.active);
    }

    // Date range filter
    const startDateRange = getFilterValue<EmployeeFilters, 'startDate'>(
      filters,
      'startDate',
    );
    if (startDateRange) {
      result = result.filter((emp) => {
        const empDate = new Date(emp.startDate);
        if (startDateRange.startDate && empDate < startDateRange.startDate) {
          return false;
        }
        if (startDateRange.endDate && empDate > startDateRange.endDate) {
          return false;
        }
        return true;
      });
    }

    return result;
  });

  /**
   * Example of typed filter value access for display purposes.
   */
  protected readonly activeNameFilter = computed(() => {
    return getFilterValue<EmployeeFilters, 'name'>(
      this.appliedFilters(),
      'name',
    );
  });

  protected readonly activeSalaryFilter = computed(() => {
    return getFilterValue<EmployeeFilters, 'salary'>(
      this.appliedFilters(),
      'salary',
    );
  });

  protected readonly activeStartDateFilter = computed(() => {
    return getFilterValue<EmployeeFilters, 'startDate'>(
      this.appliedFilters(),
      'startDate',
    );
  });
}
