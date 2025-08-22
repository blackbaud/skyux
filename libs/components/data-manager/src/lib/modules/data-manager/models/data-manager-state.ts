import { SkyDataManagerFilterData } from './data-manager-filter-data';
import { SkyDataManagerSortOption } from './data-manager-sort-option';
import { SkyDataManagerStateExtensions } from './data-manager-state-extensions';
import { SkyDataManagerStateOptions } from './data-manager-state-options';
import { SkyDataViewState } from './data-view-state';
import { SkyDataViewStateOptions } from './data-view-state-options';

/**
 * Provides options that control which data to display.
 */
export class SkyDataManagerState {
  /**
   * The selected SkyDataManagerSortOption to apply.
   */
  public activeSortOption: SkyDataManagerSortOption | undefined;
  /**
   * An untyped property that tracks any state information that's relevant to a data
   * manager but that the existing properties do not cover.
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public additionalData: any;
  /**
   * Stores settings for data manager extensions.
   */
  public extensions: SkyDataManagerStateExtensions | undefined;
  /**
   * The state of the filters.
   */
  public filterData: SkyDataManagerFilterData | undefined;
  /**
   * Whether to display only the selected rows or objects. The multiselect toolbar
   * uses this property.
   */
  public onlyShowSelected: boolean | undefined;
  /**
   * The search text to apply.
   */
  public searchText: string | undefined;
  /**
   * The currently selected rows or objects.
   */
  public selectedIds: string[] | undefined;
  /**
   * The states of the individual views.
   */
  public views: SkyDataViewState[] = [];

  constructor(data: SkyDataManagerStateOptions) {
    const views =
      data.views && data.views.map((view) => new SkyDataViewState(view));

    this.activeSortOption = data.activeSortOption;
    this.additionalData = data.additionalData;
    this.extensions = data.extensions;
    this.filterData = data.filterData;
    this.onlyShowSelected = data.onlyShowSelected;
    this.selectedIds = data.selectedIds;
    this.searchText = data.searchText;
    this.views = views || [];
  }

  /**
   * Returns the `SkyDataManagerStateOptions` for the data manager.
   * @returns The `SkyDataManagerStateOptions` for the data manager.
   */
  public getStateOptions(): SkyDataManagerStateOptions {
    const viewStates: SkyDataViewStateOptions[] = this.views.map((view) => {
      return view.getViewStateOptions();
    });

    return {
      activeSortOption: this.activeSortOption,
      additionalData: this.additionalData,
      extensions: this.extensions,
      filterData: this.filterData,
      onlyShowSelected: this.onlyShowSelected,
      searchText: this.searchText,
      selectedIds: this.selectedIds,
      views: viewStates,
    };
  }

  /**
   * Returns the `SkyDataViewState` for the specified view.
   * @param viewId The ID for the view.
   * @returns The `SkyDataViewState` for the specified view.
   */
  public getViewStateById(viewId: string): SkyDataViewState | undefined {
    return this.views.find((view) => view.viewId === viewId);
  }

  /**
   * Adds a `SkyDataViewState` to a view or updates an existing view.
   * @param viewId The ID for the view.
   * @param view The `SkyDataViewState` option to add or update.
   * @returns The state of the data manager for the specified view.
   */
  public addOrUpdateView(
    viewId: string,
    view: SkyDataViewState,
  ): SkyDataManagerState {
    const existingViewIndex = this.views.findIndex((v) => v.viewId === viewId);

    if (existingViewIndex !== -1) {
      this.views[existingViewIndex] = view;
    } else {
      this.views.push(view);
    }

    return new SkyDataManagerState({
      activeSortOption: this.activeSortOption,
      additionalData: this.additionalData,
      extensions: this.extensions,
      filterData: this.filterData,
      searchText: this.searchText,
      selectedIds: this.selectedIds,
      views: this.views,
    });
  }
}
