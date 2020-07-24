import {
  SkyDataManagerFilterData
} from './data-manager-filter-data';

import {
  SkyDataManagerStateOptions
} from './data-manager-state-options';

import {
  SkyDataManagerSortOption
} from './data-manager-sort-option';

import {
  SkyDataViewState
} from './data-view-state';

import {
  SkyDataViewStateOptions
} from './data-view-state-options';

export class SkyDataManagerState {
  public activeSortOption: SkyDataManagerSortOption;
  public additionalData: any;
  public filterData: SkyDataManagerFilterData;
  public onlyShowSelected: boolean;
  public searchText: string;
  public selectedIds: string[];
  public views: SkyDataViewState[] = [];

  constructor(data: SkyDataManagerStateOptions) {
    let views = data.views && data.views.map(view => new SkyDataViewState(view));

    this.activeSortOption = data.activeSortOption;
    this.additionalData = data.additionalData;
    this.filterData = data.filterData;
    this.onlyShowSelected = data.onlyShowSelected;
    this.selectedIds = data.selectedIds;
    this.searchText = data.searchText;
    this.views = views || [];
  }

  public getStateOptions(): SkyDataManagerStateOptions {
    let viewStates: SkyDataViewStateOptions[] = this.views.map(view => {
      return view.getViewStateOptions();
    });

    return {
      activeSortOption: this.activeSortOption,
      additionalData: this.additionalData,
      filterData: this.filterData,
      onlyShowSelected: this.onlyShowSelected,
      searchText: this.searchText,
      selectedIds: this.selectedIds,
      views: viewStates
    };
  }

  public getViewStateById(viewId: string): SkyDataViewState {
    return this.views.find(view => view.viewId === viewId);
  }

  public addOrUpdateView(viewId: string, view: SkyDataViewState): SkyDataManagerState {
    const existingViewIndex = this.views.findIndex(v => v.viewId === viewId);

    if (existingViewIndex !== -1) {
      this.views[existingViewIndex] = view;
    } else {
      this.views.push(view);
    }

    return new SkyDataManagerState({
      activeSortOption: this.activeSortOption,
      additionalData: this.additionalData,
      filterData: this.filterData,
      searchText: this.searchText,
      selectedIds: this.selectedIds,
      views: this.views
    });
  }
}
