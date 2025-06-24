import { SkyFilterBarFilterValue } from './filter-bar-filter-value';
import { SkyFilterBarFilterModalConfig } from './filter-modal-config';

export interface SkyFilterBarFilter {
  id: string | number;
  name: string;
  filterValue?: SkyFilterBarFilterValue;
  filterModalConfig?: SkyFilterBarFilterModalConfig;
}
