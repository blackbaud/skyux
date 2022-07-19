import { AfterViewInit, ChangeDetectorRef, Component } from '@angular/core';
import { Router } from '@angular/router';
import {
  SkyDataManagerService,
  SkyDataManagerState,
  SkyDataViewConfig,
} from '@skyux/data-manager';

import { IntegrationInfo } from '../shared/integration-info/integration-info';
import { IntegrationRouteInfo } from '../shared/integration-info/integration-route-info';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  providers: [SkyDataManagerService],
})
export class HomeComponent implements AfterViewInit {
  public integrationsData: IntegrationInfo[] = [];

  public dataManagerConfig = {
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

  public dataState: SkyDataManagerState;

  public defaultDataState = new SkyDataManagerState({
    activeSortOption: this.dataManagerConfig.sortOptions[0],
    views: [
      {
        viewId: 'integrations',
      },
    ],
  });

  public displayedItems: IntegrationInfo[] = [];

  public viewConfig: SkyDataViewConfig = {
    id: 'integrations',
    name: 'Integrations',
    sortEnabled: true,
    searchEnabled: true,
    filterButtonEnabled: false,
    showSortButtonText: true,
  };

  constructor(
    router: Router,
    private changeDetector: ChangeDetectorRef,
    private dataManagerService: SkyDataManagerService
  ) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (
      router.config
        .find((route) => route.path === 'integrations')
        .loadChildren() as Promise<any>
    ).then((integrationsRoutes) => {
      this.createComponentData(integrationsRoutes.routes, 'integrations').then(
        () => {
          this.dataManagerService.initDataManager({
            activeViewId: 'integrations',
            dataManagerConfig: this.dataManagerConfig,
            defaultDataState: this.defaultDataState,
          });

          this.dataManagerService.initDataView(this.viewConfig);

          this.displayedItems = this.sortItems(
            this.searchItems(this.integrationsData)
          );
          this.changeDetector.markForCheck();
        }
      );
    });
  }

  public ngAfterViewInit() {
    this.dataManagerService
      .getDataStateUpdates('integrations')
      .subscribe((state) => {
        this.dataState = state;
        if (this.integrationsData) {
          this.displayedItems = this.sortItems(
            this.searchItems(this.integrationsData)
          );
          this.changeDetector.detectChanges();
        }
      });
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private createComponentData(
    routes: IntegrationRouteInfo[],
    parentPath: string
  ): Promise<any> {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const promises: Promise<any>[] = [];

    for (const route of routes) {
      if (route.loadChildren) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        promises.push(
          (route.loadChildren() as Promise<any>).then((newRoutes) => {
            if (newRoutes.routes instanceof Array) {
              return this.createComponentData(
                newRoutes.routes,
                parentPath + '/' + route.path
              );
            }
          })
        );
      } else if (route.data) {
        route.data.path = parentPath + '/' + route.path;
        this.integrationsData.push(route.data);
        promises.push(Promise.resolve());
      }
    }
    return Promise.allSettled(promises);
  }

  private sortItems(items: IntegrationInfo[]): IntegrationInfo[] {
    let result = items;
    const sortOption = this.dataState && this.dataState.activeSortOption;

    if (sortOption) {
      result = items.sort(function (a: IntegrationInfo, b: IntegrationInfo) {
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

  private searchItems(items: IntegrationInfo[]): IntegrationInfo[] {
    let searchedItems = items;
    const searchText =
      this.dataState && this.dataState.searchText?.toUpperCase();

    if (searchText) {
      searchedItems = items.filter(function (item: IntegrationInfo) {
        let property: unknown;

        for (property in item) {
          if (
            Object.prototype.hasOwnProperty.call(item, property) &&
            property === 'name'
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
}
