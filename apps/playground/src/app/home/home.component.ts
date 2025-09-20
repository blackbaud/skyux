import { AfterViewInit, ChangeDetectorRef, Component } from '@angular/core';
import { Router } from '@angular/router';
import {
  SkyDataManagerService,
  SkyDataManagerState,
  SkyDataViewConfig,
} from '@skyux/data-manager';

import { ComponentInfo } from '../shared/component-info/component-info';
import { ComponentRouteInfo } from '../shared/component-info/component-route-info';

import { HomeFiltersModalDemoComponent } from './home-filter.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  providers: [SkyDataManagerService],
  standalone: false,
})
export class HomeComponent implements AfterViewInit {
  public componentData: ComponentInfo[] = [];

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

  public displayedItems: ComponentInfo[] = [];

  public viewConfig: SkyDataViewConfig = {
    id: 'playgroundComponents',
    name: 'Playground Components',
    sortEnabled: true,
    searchEnabled: true,
    filterButtonEnabled: true,
    showSortButtonText: true,
  };

  constructor(
    router: Router,
    private changeDetector: ChangeDetectorRef,
    private dataManagerService: SkyDataManagerService,
  ) {
    void (
      router.config
        .find((route) => route.path === 'components')
        .loadChildren() as Promise<any>
    ).then((componentsRoutes) => {
      void this.createComponentData(componentsRoutes.routes, 'components').then(
        () => {
          this.defaultDataState.filterData.filters = {
            libraries: [
              ...new Set(
                this.componentData.map((data) => {
                  return data.library;
                }),
              ),
            ]
              .sort()
              .map((libraryName) => {
                return { name: libraryName, isSelected: false };
              }),
          };

          this.dataManagerService.initDataManager({
            activeViewId: 'playgroundComponents',
            dataManagerConfig: this.dataManagerConfig,
            defaultDataState: this.defaultDataState,
          });

          this.dataManagerService.initDataView(this.viewConfig);

          this.displayedItems = this.sortItems(
            this.filterItems(this.searchItems(this.componentData)),
          );
          this.changeDetector.markForCheck();
        },
      );
    });
  }

  public ngAfterViewInit(): void {
    this.dataManagerService
      .getDataStateUpdates('playgroundComponents')
      .subscribe((state) => {
        this.dataState = state;
        if (this.componentData) {
          this.displayedItems = this.sortItems(
            this.filterItems(this.searchItems(this.componentData)),
          );
          this.changeDetector.detectChanges();
        }
      });
  }

  private createComponentData(
    routes: ComponentRouteInfo[],
    parentPath: string,
  ): Promise<unknown> {
    const promises: Promise<unknown>[] = [];

    for (const route of routes) {
      if (route.loadChildren) {
        promises.push(
          (route.loadChildren() as Promise<any>).then((newRoutes) => {
            // Account for a lazy-loaded module or a lazy-loaded routes array
            // as a default export.
            const routes = newRoutes.routes || newRoutes.default;

            if (Array.isArray(routes)) {
              return this.createComponentData(
                routes,
                parentPath + '/' + route.path,
              );
            }
          }),
        );
      } else if (route.data && !this.componentData.includes(route.data)) {
        route.data.path = parentPath + '/' + route.path;
        this.componentData.push(route.data);
        promises.push(Promise.resolve());
      }
    }
    return Promise.allSettled(promises);
  }

  private sortItems(items: ComponentInfo[]): ComponentInfo[] {
    let result = items;
    const sortOption = this.dataState && this.dataState.activeSortOption;

    if (sortOption) {
      result = items.sort(function (a: ComponentInfo, b: ComponentInfo) {
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

  private searchItems(items: ComponentInfo[]): ComponentInfo[] {
    let searchedItems = items;
    const searchText =
      this.dataState && this.dataState.searchText?.toUpperCase();

    if (searchText) {
      searchedItems = items.filter(function (item: ComponentInfo) {
        let property: unknown;

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

  private filterItems(items: ComponentInfo[]): ComponentInfo[] {
    let filteredItems = items;
    const filterData = this.dataState && this.dataState.filterData;

    if (filterData && filterData.filters && filterData.filtersApplied) {
      const filters = filterData.filters;
      filteredItems = items.filter((item: ComponentInfo) => {
        if (
          filters.libraries.find((library) => library.name === item.library)
            .isSelected
        ) {
          return true;
        }
        return false;
      });
    }

    return filteredItems;
  }
}
