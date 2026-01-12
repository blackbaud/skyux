import { Component, signal } from '@angular/core';
import { SkyDataGridModule } from '@skyux/data-grid';
import { SkyFilterBarModule } from '@skyux/filter-bar';
import { SkyFilterStateFilterItem } from '@skyux/lists';

import { HideInactiveFilterModalComponent } from './hide-inactive-filter-modal.component';
import { NameFilterModalComponent } from './name-filter-modal.component';
import { SalaryFilterModalComponent } from './salary-filter-modal.component';
import { StartDateFilterModalComponent } from './start-date-filter-modal.component';

interface Employee {
  id: string;
  name: string;
  department: string;
  salary: number;
  startDate: string;
  active: boolean;
}

/**
 * @title Filtered data grid
 */
@Component({
  selector: 'app-filtered-grid',
  imports: [SkyDataGridModule, SkyFilterBarModule],
  templateUrl: './example.component.html',
})
export class FilteredDataGridComponent {
  protected readonly nameFilterModal = NameFilterModalComponent;
  protected readonly salaryFilterModal = SalaryFilterModalComponent;
  protected readonly hideInactiveModal = HideInactiveFilterModalComponent;
  protected readonly startDateFilterModal = StartDateFilterModalComponent;

  protected readonly appliedFilters = signal<SkyFilterStateFilterItem[]>([]);

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
}
