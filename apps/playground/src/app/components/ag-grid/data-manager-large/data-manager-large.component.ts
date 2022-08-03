import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
} from '@angular/core';
import { SkyAgGridService } from '@skyux/ag-grid';
import {
  SkyDataManagerConfig,
  SkyDataManagerService,
  SkyDataManagerState,
} from '@skyux/data-manager';

import { GridOptions } from 'ag-grid-community';

import { CustomLinkComponent } from './custom-link/custom-link.component';
import { columnDefinitions, data } from './data-set-large';

@Component({
  selector: 'app-data-manager-large',
  templateUrl: './data-manager-large.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DataManagerLargeComponent implements OnInit {
  public dataManagerConfig: SkyDataManagerConfig = {};

  public defaultDataState = new SkyDataManagerState({
    filterData: {
      filtersApplied: false,
      filters: {},
    },
    views: [
      {
        viewId: 'gridView',
        displayedColumnIds: [
          'select',
          'credit_line',
          'object_date',
          'title',
          'artist_display_name',
          'artist_display_bio',
          'accessionyear',
          'repository',
          'object_wikidata_url',
          'artist_wikidata_url',
          'link_resource',
        ],
      },
    ],
  });

  public viewId = 'gridView';

  public dataState: SkyDataManagerState;
  public items = data;
  public settingsKey = 'large-test';
  public gridOptions: GridOptions;
  public isActive = true;

  constructor(
    private changeDetector: ChangeDetectorRef,
    private dataManagerService: SkyDataManagerService,
    private agGridService: SkyAgGridService
  ) {}

  public ngOnInit(): void {
    this.gridOptions = this.agGridService.getGridOptions({
      gridOptions: {
        columnDefs: columnDefinitions,
        columnTypes: {
          custom_link: {
            cellRendererFramework: CustomLinkComponent,
          },
        },
        context: {
          enableTopScroll: true,
        },
      },
    });

    this.dataManagerService.getActiveViewIdUpdates().subscribe((id) => {
      this.isActive = id === this.viewId;
      this.changeDetector.markForCheck();
    });

    this.dataManagerService.initDataManager({
      activeViewId: 'gridView',
      dataManagerConfig: this.dataManagerConfig,
      defaultDataState: this.defaultDataState,
      settingsKey: this.settingsKey,
    });

    this.dataManagerService.initDataView({
      id: this.viewId,
      name: 'Grid View',
      icon: 'table',
      searchEnabled: true,
      sortEnabled: true,
      multiselectToolbarEnabled: true,
      columnPickerEnabled: true,
      filterButtonEnabled: true,
      showFilterButtonText: true,
      columnOptions: columnDefinitions.map((col) => {
        return {
          id: col.field,
          label: col.headerName,
          alwaysDisplayed: ['select'].includes(col.field),
        };
      }),
    });
  }
}
