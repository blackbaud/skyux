import type { OnInit } from '@angular/core';
import { Component, ViewChild, ViewEncapsulation } from '@angular/core';
import { SkyResponsiveHostDirective } from '@skyux/core';
import type {
  SkyDataManagerService,
  SkyDataViewConfig,
} from '@skyux/data-manager';
import { SkyDataManagerModule, SkyDataManagerState } from '@skyux/data-manager';
import { SkyTextHighlightModule } from '@skyux/indicators';

import { AgGridAngular } from 'ag-grid-angular';
import type { ColDef, GridOptions } from 'ag-grid-community';
import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community';

import { SkyAgGridDataManagerAdapterDirective } from '../ag-grid-data-manager-adapter.directive';
import { SkyAgGridWrapperComponent } from '../ag-grid-wrapper.component';
import type { SkyAgGridService } from '../ag-grid.service';
import { SkyCellType } from '../types/cell-type';

import { SKY_AG_GRID_DATA } from './ag-grid-data.fixture';

ModuleRegistry.registerModules([AllCommunityModule]);

@Component({
  selector: 'sky-ag-grid-data-manager-component-fixture',
  templateUrl: './ag-grid-data-manager.component.fixture.html',
  encapsulation: ViewEncapsulation.None,
  imports: [
    SkyDataManagerModule,
    SkyResponsiveHostDirective,
    SkyTextHighlightModule,
    SkyAgGridDataManagerAdapterDirective,
    SkyAgGridWrapperComponent,
    AgGridAngular,
  ],
})
export class SkyAgGridDataManagerFixtureComponent implements OnInit {
  @ViewChild(AgGridAngular)
  public agGrid: AgGridAngular | undefined;

  public columnDefs: ColDef[] = [
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
    {
      colId: 'noHeader',
    },
  ];

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
        columnWidths: {
          xs: { name: 180, target: 220 },
          sm: { name: 300, target: 400 },
        },
      },
    ],
  });

  #dataManagerService: SkyDataManagerService;
  #gridService: SkyAgGridService;

  constructor(
    dataManagerService: SkyDataManagerService,
    gridService: SkyAgGridService,
  ) {
    this.#dataManagerService = dataManagerService;
    this.#gridService = gridService;
  }

  public ngOnInit(): void {
    this.gridOptions = this.#gridService.getGridOptions({
      gridOptions: this.gridOptions,
    });
    this.#dataManagerService.initDataManager({
      dataManagerConfig: {},
      defaultDataState: this.initialDataState,
      activeViewId: this.viewConfig.id,
      settingsKey: 'test',
    });

    this.#dataManagerService.initDataView(this.viewConfig);
  }
}
