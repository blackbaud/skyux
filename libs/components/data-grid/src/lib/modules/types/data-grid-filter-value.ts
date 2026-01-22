import { SkyDateRange } from '@skyux/datetime';

import { SkyDataGridNumberRangeFilterValue } from './data-grid-number-range-filter-value';

export type SkyDataGridFilterValue =
  | SkyDataGridNumberRangeFilterValue
  | SkyDateRange
  | boolean
  | number
  | string
  | string[];
