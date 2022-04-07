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
  additionalData?: any;
  /**
   * The state of the filters.
   */
  filterData?: SkyDataManagerFilterData;
  /**
   * Indicates whether to display only the selected rows or objects. The multiselect toolbar
   * uses this property.
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
