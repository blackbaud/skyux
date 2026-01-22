import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { SkyNumericPipe } from '@skyux/core';
import { SkyDataGridModule } from '@skyux/data-grid';
import { SkyDatePipe } from '@skyux/datetime';
import { SkyFilterBarModule } from '@skyux/filter-bar';
import { SkyFilterStateFilterItem } from '@skyux/lists';

import { Employee, employees } from './data';
import { HideInactiveFilterModalComponent } from './hide-inactive-filter-modal.component';
import { NameFilterModalComponent } from './name-filter-modal.component';
import { SalaryFilterModalComponent } from './salary-filter-modal.component';
import { StartDateFilterModalComponent } from './start-date-filter-modal.component';

/**
 * @title Filtered data grid
 */
@Component({
  selector: 'app-filtered-data-grid',
  imports: [SkyDataGridModule, SkyFilterBarModule, SkyNumericPipe, SkyDatePipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './example.component.html',
})
export class FilteredDataGridComponent {
  protected readonly nameFilterModal = NameFilterModalComponent;
  protected readonly salaryFilterModal = SalaryFilterModalComponent;
  protected readonly hideInactiveModal = HideInactiveFilterModalComponent;
  protected readonly startDateFilterModal = StartDateFilterModalComponent;

  protected readonly appliedFilters = signal<
    SkyFilterStateFilterItem<Employee[keyof Employee]>[]
  >([]);

  protected readonly allEmployees: Employee[] = employees;
}
