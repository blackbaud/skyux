import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
} from '@angular/core';
import {
  SkyDataManagerService,
  SkyDataManagerState,
} from '@skyux/data-manager';

import { AG_GRID_DEMO_DATA } from './data-manager-data-grid-demo-data';
import { DataManagerDataGridDemoFiltersModalComponent } from './data-manager-data-grid-demo-filter-modal.component';

@Component({
  selector: 'app-data-manager-data-grid-demo',
  templateUrl: './data-manager-data-grid-demo.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [SkyDataManagerService],
})
export class DataManagerDataGridDemoComponent implements OnInit {
  public items = AG_GRID_DEMO_DATA;

  public dataState = new SkyDataManagerState({});

  public dataManagerConfig = {
    filterModalComponent: DataManagerDataGridDemoFiltersModalComponent,
    sortOptions: [
      {
        id: 'az',
        label: 'Name (A - Z)',
        descending: false,
        propertyName: 'name',
      },
      {
        id: 'za',
        label: 'Name (Z - A)',
        descending: true,
        propertyName: 'name',
      },
    ],
  };

  public defaultDataState = new SkyDataManagerState({
    filterData: {
      filtersApplied: false,
      filters: {
        hideSales: false,
        jobTitle: 'any',
      },
    },
    views: [
      {
        viewId: 'dataGridWithDataManagerView',
        columnIds: [
          'name',
          'age',
          'startDate',
          'endDate',
          'department',
          'jobTitle',
        ],
        displayedColumnIds: [
          'name',
          'age',
          'startDate',
          'endDate',
          'department',
          'jobTitle',
        ],
      },
    ],
  });

  public activeViewId = 'dataGridWithDataManagerView';

  constructor(
    private changeDetector: ChangeDetectorRef,
    private dataManagerService: SkyDataManagerService
  ) {
    this.dataManagerService
      .getDataStateUpdates('dataGridDataManager')
      .subscribe((state) => {
        this.dataState = state;
        this.changeDetector.detectChanges();
      });
    this.dataManagerService
      .getActiveViewIdUpdates()
      .subscribe((activeViewId) => {
        this.activeViewId = activeViewId;
        this.changeDetector.detectChanges();
      });
  }

  public ngOnInit(): void {
    this.dataManagerService.initDataManager({
      activeViewId: this.activeViewId,
      dataManagerConfig: this.dataManagerConfig,
      defaultDataState: this.defaultDataState,
    });
  }
}
