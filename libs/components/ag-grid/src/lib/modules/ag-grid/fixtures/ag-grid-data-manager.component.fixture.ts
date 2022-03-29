import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import {
  SkyDataManagerConfig,
  SkyDataManagerService,
  SkyDataManagerState,
  SkyDataViewConfig,
} from '@skyux/data-manager';

import { AgGridAngular } from '@ag-grid-community/angular';
import { GridOptions } from '@ag-grid-community/core';

import { SkyAgGridService } from '../ag-grid.service';
import { SkyCellType } from '../types/cell-type';

import { SKY_AG_GRID_DATA } from './ag-grid-data.fixture';

@Component({
  selector: 'sky-ag-grid-data-manager-component-fixture',
  templateUrl: './ag-grid-data-manager.component.fixture.html',
  encapsulation: ViewEncapsulation.None,
})
export class SkyAgGridDataManagerFixtureComponent implements OnInit {
  @ViewChild(AgGridAngular)
  public agGrid: AgGridAngular;

  public columnDefs = [
    {
      field: 'selected',
      headerName: '',
      maxWidth: 50,
      sortable: false,
      type: SkyCellType.RowSelector,
    },
    {
      field: 'name',
      headerName: 'First Name',
    },
    {
      field: 'target',
      headerName: 'Goal',
      type: SkyCellType.Number,
    },
  ];

  public dataConfig: SkyDataManagerConfig = {
    sortOptions: [
      {
        id: 'name',
        descending: true,
        propertyName: 'name',
        label: 'Name',
      },
    ],
  };

  public displayFirstGrid = true;
  public displaySecondGrid = false;

  public gridData = SKY_AG_GRID_DATA;

  public gridOptions: GridOptions = {
    columnDefs: this.columnDefs,
  };

  public viewConfig: SkyDataViewConfig = {
    id: 'gridView',
    name: 'Grid View',
  };

  public initialDataState = new SkyDataManagerState({
    views: [
      {
        viewId: this.viewConfig.id,
        displayedColumnIds: ['selected', 'name', 'target'],
      },
    ],
  });

  constructor(
    private dataManagerService: SkyDataManagerService,
    private gridService: SkyAgGridService
  ) {}

  public ngOnInit(): void {
    this.gridOptions = this.gridService.getEditableGridOptions({
      gridOptions: this.gridOptions,
    });
    this.dataManagerService.initDataManager({
      dataManagerConfig: this.dataConfig,
      defaultDataState: this.initialDataState,
      activeViewId: this.viewConfig.id,
      settingsKey: 'test',
    });

    this.dataManagerService.initDataView(this.viewConfig);
  }
}
