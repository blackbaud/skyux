import { SkyFilterBarFilterModalConfig } from './filter-bar-filter-modal-config';
import { SkyFilterBarFilterValue } from './filter-bar-filter-value';

export interface SkyFilterBarFilterItem {
  id: string;
  name: string;
  filterValue?: SkyFilterBarFilterValue;
  filterModalConfig?: SkyFilterBarFilterModalConfig;
}
