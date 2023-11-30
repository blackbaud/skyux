import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  OnInit,
} from '@angular/core';
import { SkyAgGridModule, SkyAgGridService, SkyCellType } from '@skyux/ag-grid';
import {
  SkyDataManagerModule,
  SkyDataManagerService,
  SkyDataManagerState,
  SkyDataViewConfig,
} from '@skyux/data-manager';
import { SkyPagingContentChangeArgs, SkyPagingModule } from '@skyux/lists';

import { AgGridModule } from 'ag-grid-angular';
import {
  ColDef,
  ColumnApi,
  GridApi,
  GridOptions,
  GridReadyEvent,
} from 'ag-grid-community';

import { DataManagerPagedItemsPipe } from './data-manager-paged-items.pipe';

@Component({
  selector: 'app-data-view-grid',
  standalone: true,
  imports: [
    AgGridModule,
    CommonModule,
    DataManagerPagedItemsPipe,
    SkyAgGridModule,
    SkyDataManagerModule,
    SkyPagingModule,
  ],
  templateUrl: './data-view-grid.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DataViewGridComponent implements OnInit {
  @Input()
  public items: any[];

  public viewId = 'gridView';

  public columnDefs: ColDef[] = [
    {
      colId: 'selected',
      field: 'selected',
      headerName: '',
      maxWidth: 50,
      type: SkyCellType.RowSelector,
      suppressMovable: true,
      lockPosition: true,
      lockVisible: true,
    },
    {
      colId: 'name',
      field: 'name',
      headerName: 'Fruit name',
      width: 150,
    },
    {
      colId: 'description',
      field: 'description',
      headerName: 'Description',
    },
  ];

  public dataState = new SkyDataManagerState({});

  public viewConfig: SkyDataViewConfig = {
    id: this.viewId,
    name: 'Grid View',
    icon: 'table',
    searchEnabled: true,
    sortEnabled: true,
    multiselectToolbarEnabled: true,
    columnPickerEnabled: true,
    filterButtonEnabled: true,
    columnOptions: [
      {
        id: 'selected',
        alwaysDisplayed: true,
        label: 'selected',
      },
      {
        id: 'name',
        label: 'Fruit name',
        description: 'The name of the fruit.',
      },
      {
        id: 'description',
        label: 'Description',
        description: 'Some information about the fruit.',
      },
    ],
  };

  public columnApi: ColumnApi;
  public filteredItems: any[];
  public gridApi: GridApi;
  public gridInitialized: boolean;
  public gridOptions: GridOptions;
  public isActive: boolean;

  protected currentPage = 1;
  protected readonly pageSize = 5;

  constructor(
    private agGridService: SkyAgGridService,
    private changeDetector: ChangeDetectorRef,
    private dataManagerService: SkyDataManagerService
  ) {}

  public ngOnInit(): void {
    this.filteredItems = this.items;

    this.dataManagerService.initDataView(this.viewConfig);

    this.gridOptions = this.agGridService.getGridOptions({
      gridOptions: {
        columnDefs: this.columnDefs,
        onGridReady: this.onGridReady.bind(this),
      },
    });

    this.dataManagerService
      .getDataStateUpdates(this.viewId)
      .subscribe((state) => {
        this.dataState = state;
        this.currentPage = state.additionalData?.currentPage ?? 1;
        this.setInitialColumnOrder();
        this.updateData();
        this.changeDetector.detectChanges();
      });

    this.dataManagerService.getActiveViewIdUpdates().subscribe((id) => {
      this.isActive = id === this.viewId;
    });
  }

  public updateData(): void {
    this.sortItems();
    this.filteredItems = this.#filterItems(this.searchItems(this.items));

    if (this.dataState.onlyShowSelected) {
      this.filteredItems = this.filteredItems.filter((item) => item.selected);
    }
  }

  public setInitialColumnOrder(): void {
    const viewState = this.dataState.getViewStateById(this.viewId);
    const visibleColumns = viewState.displayedColumnIds;

    this.columnDefs.sort((col1, col2) => {
      const col1Index = visibleColumns.findIndex(
        (colId: string) => colId === col1.colId
      );
      const col2Index = visibleColumns.findIndex(
        (colId: string) => colId === col2.colId
      );

      if (col1Index === -1) {
        col1.hide = true;
        return 0;
      } else if (col2Index === -1) {
        col2.hide = true;
        return 0;
      } else {
        return col1Index - col2Index;
      }
    });

    this.gridInitialized = true;
  }

  public onGridReady(event: GridReadyEvent): void {
    this.columnApi = event.columnApi;
    this.gridApi = event.api;
    this.gridApi.sizeColumnsToFit();
    this.updateData();
  }

  public sortItems(): void {
    const sortOption = this.dataState.activeSortOption;
    if (this.columnApi && sortOption) {
      const allColumns = this.columnApi.getColumns();
      allColumns.forEach((column) => {
        if (column.getColId() === sortOption.propertyName) {
          column.setSort(sortOption.descending ? 'desc' : 'asc');
        } else {
          column.setSort(undefined);
        }
      });
    }
  }

  public searchItems(items: any[]): any[] {
    let searchedItems = items;
    const searchText = this.dataState && this.dataState.searchText;

    if (searchText) {
      searchedItems = items.filter(function (item: any) {
        let property: any;

        for (property in item) {
          if (property === 'name' || property === 'description') {
            const propertyText = item[property].toLowerCase();
            if (propertyText.indexOf(searchText) > -1) {
              return true;
            }
          }
        }

        return false;
      });
    }
    return searchedItems;
  }

  protected onContentChange(args: SkyPagingContentChangeArgs): void {
    setTimeout(() => {
      this.currentPage = args.currentPage;

      this.dataState.additionalData.currentPage = args.currentPage;
      this.#updateDataState();

      args.loadingComplete();
    }, 500);
  }

  #filterItems(items: any[]): any[] {
    let filteredItems = items;
    const filterData = this.dataState && this.dataState.filterData;

    if (filterData && filterData.filters) {
      const filters = filterData.filters;
      filteredItems = items.filter((item: any) => {
        if (
          ((filters.hideOrange && item.color !== 'orange') ||
            !filters.hideOrange) &&
          ((filters.type !== 'any' && item.type === filters.type) ||
            !filters.type ||
            filters.type === 'any')
        ) {
          return true;
        }
        return false;
      });
    }

    return filteredItems;
  }

  #updateDataState(): void {
    this.dataManagerService.updateDataState(this.dataState, this.viewId);
  }
}
