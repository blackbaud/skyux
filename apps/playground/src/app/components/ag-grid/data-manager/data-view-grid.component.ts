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
import { SkyFilterBarFilterState } from '@skyux/filter-bar';
import { SkyPagingContentChangeArgs, SkyPagingModule } from '@skyux/lists';

import { AgGridModule } from 'ag-grid-angular';
import {
  AllCommunityModule,
  ColDef,
  GridApi,
  GridOptions,
  GridReadyEvent,
  ModuleRegistry,
} from 'ag-grid-community';

import { DataManagerPagedItemsPipe } from './data-manager-paged-items.pipe';
import { FruitItem } from './fruit-item';

ModuleRegistry.registerModules([AllCommunityModule]);

@Component({
  selector: 'app-data-view-grid',
  imports: [
    AgGridModule,
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
    iconName: 'table',
    searchEnabled: true,
    searchHighlightEnabled: true,
    multiselectToolbarEnabled: true,
    columnPickerEnabled: true,
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

  public displayedItems: any[];
  public gridApi: GridApi;
  public gridOptions: GridOptions;
  public isActive: boolean;

  protected currentPage = 1;
  protected readonly pageSize = 5;

  constructor(
    private agGridService: SkyAgGridService,
    private changeDetector: ChangeDetectorRef,
    private dataManagerService: SkyDataManagerService,
  ) {}

  public ngOnInit(): void {
    this.displayedItems = this.items;

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
        this.updateData();
        this.changeDetector.detectChanges();
      });

    this.dataManagerService.getActiveViewIdUpdates().subscribe((id) => {
      this.isActive = id === this.viewId;
      this.changeDetector.markForCheck();
    });
  }

  public updateData(): void {
    this.displayedItems = this.#filterItems(this.searchItems(this.items));

    if (this.dataState.onlyShowSelected) {
      this.displayedItems = this.displayedItems.filter((item) => item.selected);
    }

    this.dataManagerService.updateDataSummary(
      {
        totalItems: this.items.length,
        itemsMatching: this.displayedItems.length,
      },
      this.viewId,
    );
  }

  public onGridReady(event: GridReadyEvent): void {
    this.gridApi = event.api;
    this.updateData();
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
      this.dataState.additionalData ??= {};
      this.dataState.additionalData.currentPage = args.currentPage;
      this.#updateDataState();

      args.loadingComplete();
    }, 500);
  }

  #filterItems(items: FruitItem[]): FruitItem[] {
    let filteredItems = items;
    const filterState = this.dataState.filterData?.filters as
      | SkyFilterBarFilterState
      | undefined;

    if (filterState?.appliedFilters) {
      const filters = filterState.appliedFilters;
      const hideOrange = !!filters.find(
        (f) => f.filterId === 'hideOrange' && f.filterValue?.value,
      );
      const fruitTypeFilter = filters.find((f) => f.filterId === 'fruitType');
      const selectedTypes: string[] = Array.isArray(
        fruitTypeFilter?.filterValue?.value,
      )
        ? (fruitTypeFilter.filterValue.value as Array<{ id: string }>).map(
            (v) => v.id,
          )
        : [];

      filteredItems = items.filter((item) => {
        if (hideOrange && item.color === 'orange') {
          return false;
        }
        if (selectedTypes.length && !selectedTypes.includes(item.type)) {
          return false;
        }
        return true;
      });
    }

    return filteredItems;
  }

  #updateDataState(): void {
    this.dataManagerService.updateDataState(this.dataState, this.viewId);
  }
}
