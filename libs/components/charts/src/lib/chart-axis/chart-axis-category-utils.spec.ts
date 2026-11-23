import { type SkyChartCategoryScaleType } from '../shared/category-scale-type';
import { type SkyChartTimeUnit } from '../shared/time-unit';

import { type SkyChartAxisCategory } from './chart-axis-category';
import {
  getChartLabels,
  getDisplayCategories,
} from './chart-axis-category-utils';

describe('Chart category axis utils', () => {
  function createCategoryAxis(
    categories: string[],
    scaleType: SkyChartCategoryScaleType,
    timeUnit?: SkyChartTimeUnit,
  ): SkyChartAxisCategory {
    return {
      categories: () => categories,
      scaleType: () => scaleType,
      timeUnit: () => timeUnit,
      timeStep: () => undefined,
    } as unknown as SkyChartAxisCategory;
  }

  it('should use the categories as labels on a category scale', () => {
    const axis = createCategoryAxis(['2026-01-15'], 'category');

    expect(getChartLabels(axis)).toEqual(['2026-01-15']);
    expect(getDisplayCategories(axis, 'fr-CA', 'T{0} {1}')).toEqual([
      '2026-01-15',
    ]);
  });

  it('should format time categories for the locale', () => {
    const axis = createCategoryAxis(['2026-01-15'], 'time', 'month');

    expect(getChartLabels(axis)).toEqual([new Date(2026, 0, 15).getTime()]);
    expect(getDisplayCategories(axis, 'de-DE', 'Q{0} {1}')).toEqual([
      '15. Jan. 2026',
    ]);
  });

  it('should label quarters with the quarter label', () => {
    const axis = createCategoryAxis(['2026-08-29'], 'time', 'quarter');

    expect(getDisplayCategories(axis, 'fr-CA', 'T{0} {1}')).toEqual([
      'T3 2026',
    ]);
  });
});
