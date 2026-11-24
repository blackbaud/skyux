import { InjectionToken } from '@angular/core';

import { type SkyChartCategoryAxis } from './chart-axis-category-utils';

/**
 * Provided by every category axis component so plots can query them together.
 * @internal
 */
export const SKY_CHART_CATEGORY_AXIS = new InjectionToken<SkyChartCategoryAxis>(
  'SKY_CHART_CATEGORY_AXIS',
);
