import { AfterViewInit, ChangeDetectorRef, Component } from '@angular/core';
import { Route, Router } from '@angular/router';
import { SkyDataManagerService, SkyDataManagerState, SkyDataViewConfig } from '@skyux/data-manager';
import { HomeFiltersModalDemoComponent } from './home-filter.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  providers: [SkyDataManagerService]
})
export class HomeComponent implements AfterViewInit {

  public componentData: any[] = [];

  public dataManagerConfig = {
    filterModalComponent: HomeFiltersModalDemoComponent,
    sortOptions: [
      {
        id: 'az',
        label: 'Component Name (A - Z)',
        descending: false,
        propertyName: 'name',
      },
      {
        id: 'za',
        label: 'Component Name (Z - A)',
        descending: true,
        propertyName: 'name',
      },
      {
        id: 'az-lib',
        label: 'Library Name (A - Z)',
        descending: false,
        propertyName: 'library',
      },
      {
        id: 'za-lib',
        label: 'Library Name (Z - A)',
        descending: true,
        propertyName: 'library',
      },
    ],
  };

  public dataState: SkyDataManagerState;

  public defaultDataState = new SkyDataManagerState({
    filterData: {
      filtersApplied: false,
    },
    activeSortOption: this.dataManagerConfig.sortOptions[0],
    views: [
      {
        viewId: 'playgroundComponents',
      },
    ],
  });

  public displayedItems: any[] = [];

  public viewConfig: SkyDataViewConfig = {
    id: 'playgroundComponents',
    name: 'Playground Components',
    sortEnabled: true,
    searchEnabled: true,
    filterButtonEnabled: true,
    showSortButtonText: true,
  };

  constructor(router: Router, private changeDetector: ChangeDetectorRef, private dataManagerService: SkyDataManagerService) {
    (router.config.find(route => route.path === 'components').loadChildren() as Promise<any>).then((componentsRoutes) => {
      this.createComponentData(componentsRoutes.routes, 'components').then(() => {

      this.defaultDataState.filterData.filters = { libraries: [...new Set(this.componentData.map(data => { return data.library }))].sort() };

      this.dataManagerService.initDataManager({
        activeViewId: 'playgroundComponents',
        dataManagerConfig: this.dataManagerConfig,
        defaultDataState: this.defaultDataState,
      });

      this.dataManagerService.initDataView(this.viewConfig);

        this.displayedItems = this.sortItems(
          this.filterItems(this.searchItems(this.componentData))
        );
        this.changeDetector.markForCheck();
      });
    });
  }

  public ngAfterViewInit() {
    this.dataManagerService
      .getDataStateUpdates('playgroundComponents')
      .subscribe((state) => {
        this.dataState = state;
        if (this.componentData) {
          this.displayedItems = this.sortItems(
            this.filterItems(this.searchItems(this.componentData))
          );
          this.changeDetector.detectChanges();
        }
      });
  }

  private createComponentData(routes: Route[], parentPath: string): Promise<unknown> {
    console.log(routes);

    const promises: Promise<unknown>[] = [];

    for (const route of routes) {
      if(route.loadChildren) {
        promises.push((<Promise<any>> route.loadChildren()).then((newRoutes) => {
          if (newRoutes.routes instanceof Array) {
            return this.createComponentData(newRoutes.routes, parentPath + '/' + route.path);
          }
        }));
      } else if (route.data) {
        route.data.path = parentPath + '/' + route.path;
        this.componentData.push(route.data);
        promises.push(Promise.resolve());
      }
    }
    return Promise.allSettled(promises);
  }

  private sortItems(items: any[]): any[] {
    let result = items;
    const sortOption = this.dataState && this.dataState.activeSortOption;

    if (sortOption) {
      result = items.sort(function (a: any, b: any) {
        const descending = sortOption.descending ? -1 : 1,
          sortProperty = sortOption.propertyName;

        if (a[sortProperty] > b[sortProperty]) {
          return descending;
        } else if (a[sortProperty] < b[sortProperty]) {
          return -1 * descending;
        } else {
          return 0;
        }
      });
    }

    return result;
  }

  private searchItems(items: any[]): any[] {
    let searchedItems = items;
    const searchText =
      this.dataState && this.dataState.searchText?.toUpperCase();

    if (searchText) {
      searchedItems = items.filter(function (item: any) {
        let property: any;

        for (property in item) {
          if (
            Object.prototype.hasOwnProperty.call(item, property) &&
            (property === 'name' || property === 'library')
          ) {
            const propertyText = item[property].toUpperCase();
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

  private filterItems(items: any[]): any[] {
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
}
