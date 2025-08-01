import { SkySelectionModalOpenArgs } from '@skyux/lookup';

import { SkyFilterBarFilterModalConfig } from './filter-bar-filter-modal-config';
import { SkyFilterBarFilterValue } from './filter-bar-filter-value';

/**
 * A configuration object for how a filter is displayed on the filter bar.
 * @internal
 */
export interface SkyFilterBarItem {
  /**
   * A unique identifier for the filter.
   */
  id: string;
  /**
   * The human-readable display string for the filter.
   */
  name: string;
  /**
   * The value of the filter, if it is set.
   */
  filterValue?: SkyFilterBarFilterValue;
  /**
   * Configuration options for the modal that is invoked when a user selects a filter.
   */
  filterModalConfig?: SkyFilterBarFilterModalConfig;
  /**
   * Configuration options for using a SkySelectionModal as the filter modal.
   */
  filterSelectionModalConfig?: SkySelectionModalOpenArgs;
}
