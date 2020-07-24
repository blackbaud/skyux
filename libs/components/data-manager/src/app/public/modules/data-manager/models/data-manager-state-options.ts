import {
  SkyDataManagerFilterData
} from './data-manager-filter-data';

import {
  SkyDataManagerSortOption
} from './data-manager-sort-option';

import {
  SkyDataViewStateOptions
} from './data-view-state-options';

export interface SkyDataManagerStateOptions {
  /**
   * The selected SkyDataManagerSortOption to apply.
   */
  activeSortOption?: SkyDataManagerSortOption;
  /**
   * An untyped property that can be used to keep track of any state information relevant to a data
   * manager that is not covered by the existing properties.
   */
  additionalData?: any;
  /**
   * The state of filters.
   */
  filterData?: SkyDataManagerFilterData;
  /**
   * Indicates if only the selected rows or objects should be displayed. This is used by the multiselect toolbar.
   */
  onlyShowSelected?: boolean;
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
