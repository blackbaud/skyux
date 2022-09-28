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

import { SKY_AG_GRID_DEMO_DATA } from './data-manager-multiselect-data-grid-docs-demo-data';
import { DataManagerMultiselectDataGridDocsDemoFiltersModalComponent } from './data-manager-multiselect-data-grid-docs-demo-filter-modal.component';

@Component({
  selector: 'app-data-manager-multiselect-data-grid-docs-demo',
  templateUrl: './data-manager-multiselect-data-grid-docs-demo.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [SkyDataManagerService],
})
export class SkyDataManagerMultiselectDataGridDemoComponent implements OnInit {
  public items = SKY_AG_GRID_DEMO_DATA;

  public dataState = new SkyDataManagerState({});

  public dataManagerConfig = {
    filterModalComponent:
      DataManagerMultiselectDataGridDocsDemoFiltersModalComponent,
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
        viewId: 'dataGridMultiselectWithDataManagerView',
        columnIds: [
          'selected',
          'name',
          'age',
          'startDate',
          'endDate',
          'department',
          'jobTitle',
        ],
        displayedColumnIds: [
          'selected',
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

  public activeViewId = 'dataGridMultiselectWithDataManagerView';

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
