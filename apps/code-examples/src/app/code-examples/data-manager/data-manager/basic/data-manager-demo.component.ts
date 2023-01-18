import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { SkyUIConfigService } from '@skyux/core';
import {
  SkyDataManagerService,
  SkyDataManagerState,
} from '@skyux/data-manager';

import { DataManagerFiltersModalDemoComponent } from './data-filter-modal.component';
import {
  SKY_DATA_MANAGER_DEMO_DATA,
  SkyDataManagerDemoRow,
} from './data-manager-demo-data';

@Component({
  selector: 'app-data-manager-demo',
  templateUrl: './data-manager-demo.component.html',
  providers: [SkyDataManagerService, SkyUIConfigService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DataManagerDemoComponent implements OnInit {
  public dataManagerConfig = {
    filterModalComponent: DataManagerFiltersModalDemoComponent,
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
      filtersApplied: true,
      filters: {
        hideOrange: true,
      },
    },
    views: [
      {
        viewId: 'gridView',
        displayedColumnIds: ['selected', 'name', 'description'],
      },
    ],
  });

  public dataState: SkyDataManagerState | undefined;

  public items: SkyDataManagerDemoRow[] = SKY_DATA_MANAGER_DEMO_DATA;

  public activeViewId = 'repeaterView';

  constructor(private dataManagerService: SkyDataManagerService) {
    this.dataManagerService
      .getDataStateUpdates('dataManager')
      .subscribe((state) => (this.dataState = state));
    this.dataManagerService
      .getActiveViewIdUpdates()
      .subscribe((activeViewId) => (this.activeViewId = activeViewId));
  }

  public ngOnInit(): void {
    this.dataManagerService.initDataManager({
      activeViewId: this.activeViewId,
      dataManagerConfig: this.dataManagerConfig,
      defaultDataState: this.defaultDataState,
    });
  }

  public searchSo(): void {
    const state = this.dataState || new SkyDataManagerState({});
    state.searchText = 'so';
    this.dataManagerService.updateDataState(state, 'dataManager');
  }
}
