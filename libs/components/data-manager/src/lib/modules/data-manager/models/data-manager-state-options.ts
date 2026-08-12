import { SkyDataManagerFilterData } from './data-manager-filter-data';
import { SkyDataManagerSortOption } from './data-manager-sort-option';
import { SkyDataViewStateOptions } from './data-view-state-options';

export interface SkyDataManagerStateOptions {
  /**
   * The selected SkyDataManagerSortOption to apply.
   */
  activeSortOption?: SkyDataManagerSortOption;
  /**
   * An untyped property that tracks any state information that's relevant to a data
   * manager but that the existing properties do not cover.
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  additionalData?: any;
  /**
   * The IDs of the columns available to display. Used by the signal-based
   * `SkyDataManagerToolbarComponent` API for consumers displaying columns
   * without a `SkyDataViewConfig`-registered view. This is tracked separately
   * from `displayedColumnIds` so that a column the user hid can be
   * distinguished from a column that has been newly added.
   * @preview
   */
  columnIds?: string[];
  /**
   * The IDs of the columns to display, in display order. Used by the
   * signal-based `SkyDataManagerToolbarComponent` API for consumers displaying
   * columns without a `SkyDataViewConfig`-registered view.
   * @preview
   */
  displayedColumnIds?: string[];
  /**
   * The state of the filters.
   */
  filterData?: SkyDataManagerFilterData;
  /**
   * Whether to display only the selected rows or objects. The multiselect toolbar
   * uses this property.
   */
  onlyShowSelected?: boolean;
  /**
   * The current page number to display. Used by the signal-based
   * `SkyDataManagerToolbarComponent` API for consumers paging data without a
   * `SkyDataViewConfig`-registered view.
   * @preview
   */
  page?: number;
  /**
   * The number of items to display per page. Used by the signal-based
   * `SkyDataManagerToolbarComponent` API for consumers paging data without a
   * `SkyDataViewConfig`-registered view.
   * @preview
   */
  pageSize?: number;
  /**
   * The search text to apply.
   */
  searchText?: string;
  /**
   * The currently selected rows or objects.
   */
  selectedIds?: string[];
  /**
   * The states of the individual views.
   */
  views?: SkyDataViewStateOptions[];
}
