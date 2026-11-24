import { type SkyChartTimeUnit } from '../shared/time-unit';

import { SkyChartAxisCategory } from './chart-axis-category';
import { SkyChartAxisCategoryTime } from './chart-axis-category-time';
import {
  getChartLabels,
  getDisplayCategories,
} from './chart-axis-category-utils';

describe('Chart category axis utils', () => {
  function createCategoryAxis(categories: string[]): SkyChartAxisCategory {
    return Object.assign(Object.create(SkyChartAxisCategory.prototype), {
      categories: () => categories,
    });
  }

  function createTimeAxis(
    categories: string[],
    timeUnit: SkyChartTimeUnit,
  ): SkyChartAxisCategoryTime {
    return Object.assign(Object.create(SkyChartAxisCategoryTime.prototype), {
      categories: () => categories,
      timeUnit: () => timeUnit,
      timeStep: () => undefined,
    });
  }

  it('should use the categories as labels on a category axis', () => {
    const axis = createCategoryAxis(['2026-01-15']);

    expect(getChartLabels(axis)).toEqual(['2026-01-15']);
    expect(getDisplayCategories(axis, 'fr-CA')).toEqual(['2026-01-15']);
  });

  it('should format time categories for the locale', () => {
    const axis = createTimeAxis(['2026-01-15'], 'month');

    expect(getChartLabels(axis)).toEqual([new Date(2026, 0, 15).getTime()]);
    expect(getDisplayCategories(axis, 'de-DE')).toEqual(['15. Jan. 2026']);
  });
});
