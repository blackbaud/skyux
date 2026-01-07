import {
  Component,
  OnInit,
  ViewChild,
  ViewEncapsulation,
  inject,
} from '@angular/core';
import {
  SkyDataManagerModule,
  SkyDataManagerService,
  SkyDataManagerState,
  SkyDataViewConfig,
} from '@skyux/data-manager';
import { SkyTextHighlightModule } from '@skyux/indicators';

import { AgGridAngular } from 'ag-grid-angular';
import {
  AllCommunityModule,
  ColDef,
  GridOptions,
  ModuleRegistry,
} from 'ag-grid-community';

import { SkyAgGridDataManagerAdapterDirective } from '../ag-grid-data-manager-adapter.directive';
import { SkyAgGridWrapperComponent } from '../ag-grid-wrapper.component';
import { SkyAgGridService } from '../ag-grid.service';
import { SkyCellType } from '../types/cell-type';

import { SKY_AG_GRID_DATA } from './ag-grid-data.fixture';

ModuleRegistry.registerModules([AllCommunityModule]);

@Component({
  selector: 'sky-ag-grid-data-manager-component-fixture',
  templateUrl: './ag-grid-data-manager.component.fixture.html',
  encapsulation: ViewEncapsulation.None,
  imports: [
    SkyDataManagerModule,
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
  public displayOtherView = false;
  public enableTopScroll = false;

  public gridData = SKY_AG_GRID_DATA;

  public gridOptions: GridOptions = {
    columnDefs: this.columnDefs,
  };

  public viewConfig: SkyDataViewConfig = {
    id: 'gridView',
    name: 'Grid View',
    iconName: 'table',
  };

  public initialDataState = new SkyDataManagerState({
    views: [
      ...(this.displayOtherView
        ? [
            {
              viewId: 'otherView',
            },
          ]
        : []),
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

  readonly #dataManagerService = inject(SkyDataManagerService);
  readonly #gridService = inject(SkyAgGridService);

  public ngOnInit(): void {
    this.gridOptions = this.#gridService.getGridOptions({
      gridOptions: this.gridOptions,
    });
    this.#dataManagerService.initDataManager({
      dataManagerConfig: {},
      defaultDataState: this.initialDataState,
      activeViewId: this.displayOtherView ? 'otherView' : this.viewConfig.id,
      settingsKey: 'test',
    });

    this.#dataManagerService.initDataView(this.viewConfig);

    if (this.displayOtherView) {
      this.#dataManagerService.initDataView({
        id: 'otherView',
        name: 'Other View',
        iconName: 'document',
      });
    }
  }
}
