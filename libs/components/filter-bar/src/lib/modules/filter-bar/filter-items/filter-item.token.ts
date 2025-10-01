import { InjectionToken } from '@angular/core';

import { SkyFilterItem } from '../models/filter-item';

/**
 * A token for filter bar items.
 * @internal
 */
export const SKY_FILTER_ITEM = new InjectionToken<SkyFilterItem>(
  'SKY_FILTER_ITEM',
);
