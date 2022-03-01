import { ListItemModel, compare, getData } from '@skyux/list-builder-common';

import { BehaviorSubject, Observable } from 'rxjs';
import { map as observableMap } from 'rxjs/operators';

import { ListFilterModel } from '../list-filters/filter.model';
import { ListDataRequestModel } from '../list/list-data-request.model';
import { ListDataResponseModel } from '../list/list-data-response.model';
import { ListDataProvider } from '../list/list-data.provider';
import { ListSearchModel } from '../list/state/search/search.model';

let idIndex = 0;

export class SkyListInMemoryDataProvider extends ListDataProvider {
  public items: BehaviorSubject<Array<ListItemModel>> = new BehaviorSubject<
    Array<ListItemModel>
  >([]);

  private lastItems: ListItemModel[];
  private lastSearch: ListSearchModel;
  private lastSearchResults: ListItemModel[];
  private searchFunction: (data: any, searchText: string) => boolean;

  private lastFilters: ListFilterModel[];
  private lastFilterResults: ListItemModel[];

  constructor(
    data?: Observable<Array<any>>,
    searchFunction?: (data: any, searchText: string) => boolean
  ) {
    super(data);

    this.searchFunction = searchFunction;

    if (data) {
      data.subscribe((items) => {
        this.items.next(
          items.map(
            (d) =>
              new ListItemModel(
                d.id || `sky-list-data-in-memory-provider-item-${++idIndex}`,
                d
              )
          )
        );
      });
    }
  }

  public count(): Observable<number> {
    return this.items.pipe(observableMap((items) => items.length));
  }

  public get(request: ListDataRequestModel): Observable<ListDataResponseModel> {
    return this.filteredItems(request).pipe(
      observableMap((result) => {
        if (request.pageNumber && request.pageSize) {
          const itemStart = (request.pageNumber - 1) * request.pageSize;
          const pagedResult = result.slice(
            itemStart,
            itemStart + request.pageSize
          );
          return new ListDataResponseModel({
            count: result.length,
            items: pagedResult,
          });
        } else {
          return new ListDataResponseModel({
            count: result.length,
            items: result,
          });
        }
      })
    );
  }

  private filteredItems(
    request: ListDataRequestModel
  ): Observable<Array<ListItemModel>> {
    const showSelectedId = ['show-selected'];

    return this.items.pipe(
      observableMap((items) => {
        let dataChanged = false;
        let search = request.search;
        const sort = request.sort;
        let filters: ListFilterModel[] = request.filters;

        if (this.lastItems === undefined || this.lastItems !== items) {
          dataChanged = true;
          this.lastItems = items;
        }

        let searchChanged = false;
        let filtersChanged = false;

        if (request.isToolbarDisabled) {
          searchChanged = true;
          search = new ListSearchModel();

          filters = filters.filter((f) => showSelectedId.indexOf(f.name) >= 0);
          filtersChanged = true;
        } else {
          if (this.lastSearch === undefined || this.lastSearch !== search) {
            searchChanged = true;
          }

          if (this.lastFilters === undefined || this.lastFilters !== filters) {
            filtersChanged = true;
          }
        }

        this.lastSearch = search;
        this.lastFilters = filters;

        let result = items;

        // Apply filters.
        if (
          !dataChanged &&
          !filtersChanged &&
          this.lastFilterResults !== undefined
        ) {
          result = this.lastFilterResults;
        } else if (filters && filters.length > 0) {
          result = result.filter((item) => {
            for (let i = 0; i < filters.length; i++) {
              const filter = filters[i];
              if (
                filter.value === undefined ||
                filter.value === '' ||
                filter.value === false ||
                filter.value === filter.defaultValue
              ) {
                continue;
              }

              if (!filter.filterFunction(item, filter.value)) {
                return false;
              }
            }
            return true;
          });

          this.lastFilterResults = result;
        } else {
          this.lastFilterResults = undefined;
        }

        // Apply search.
        /* istanbul ignore next */
        if (
          !dataChanged &&
          !searchChanged &&
          this.lastSearchResults !== undefined &&
          !filtersChanged
        ) {
          result = this.lastSearchResults;
        } else if (
          search &&
          search.searchText !== undefined &&
          search.searchText.length > 0
        ) {
          const searchText = search.searchText.toLowerCase();
          let searchFunctions: any[];
          if (this.searchFunction !== undefined) {
            searchFunctions = [this.searchFunction];
          } else {
            searchFunctions = search.functions;
          }

          result = result.filter((item) => {
            let isMatch = false;

            for (let i = 0; i < searchFunctions.length; i++) {
              const searchFunction = searchFunctions[i];
              const searchResult = searchFunction(item.data, searchText);

              if (
                (typeof searchResult === 'string' &&
                  searchResult.indexOf(searchText) !== -1) ||
                searchResult === true
              ) {
                isMatch = true;
                break;
              }
            }

            return isMatch;
          });

          this.lastSearchResults = result;
        } else {
          this.lastSearchResults = undefined;
        }

        // Apply sort.
        if (sort && sort.fieldSelectors.length > 0) {
          result = result
            .slice()
            .sort((item1: ListItemModel, item2: ListItemModel) => {
              let compareResult = 0;
              for (let i = 0; i < sort.fieldSelectors.length; i++) {
                const selector = sort.fieldSelectors[i];
                const value1 = getData(item1.data, selector.fieldSelector);
                const value2 = getData(item2.data, selector.fieldSelector);

                compareResult = compare(value1, value2);

                if (selector.descending && compareResult !== 0) {
                  compareResult *= -1;
                }

                if (compareResult !== 0) {
                  break;
                }
              }

              return compareResult;
            });
        }
        return result;
      })
    );
  }
}
