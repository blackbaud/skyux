import { formatTimeCategory } from '../chart-js/chart-js-date-adapter';
import { parseTimeCategory } from '../shared/time-category-parser';

import { type SkyChartAxisCategory } from './chart-axis-category';
import { SkyChartAxisCategoryTime } from './chart-axis-category-time';

/**
 * Either kind of category axis a cartesian plot accepts.
 * @internal
 */
export type SkyChartCategoryAxis =
  SkyChartAxisCategory | SkyChartAxisCategoryTime;

/**
 * Explains why a time axis can't be plotted, if it can't.
 * @internal
 */
export function getTimeAxisError(
  timeAxis: SkyChartAxisCategoryTime,
): string | undefined {
  const step = timeAxis.timeStep();

  if (step !== undefined && !(Number.isInteger(step) && step > 0)) {
    return (
      `The <sky-chart-axis-category-time> has a "timeStep" of "${step}", ` +
      'but it must be a positive whole number.'
    );
  }

  const invalid = timeAxis
    .categories()
    .find((category) => Number.isNaN(parseTimeCategory(category)));

  return invalid === undefined
    ? undefined
    : `The time category "${invalid}" is not a valid date. Time categories ` +
        'must be ISO 8601 date or date-time strings, such as "2026-01-15" or ' +
        '"2026-01-15T10:30:00Z".';
}

/**
 * Gets a category axis's categories as Chart.js labels.
 * @internal
 */
export function getChartLabels(
  categoryAxis: SkyChartCategoryAxis,
): readonly (string | number)[] {
  const categories = categoryAxis.categories();

  return categoryAxis instanceof SkyChartAxisCategoryTime
    ? categories.map(parseTimeCategory)
    : categories;
}

/**
 * Gets a category axis's categories as the data table shows them.
 * @internal
 */
export function getDisplayCategories(
  categoryAxis: SkyChartCategoryAxis,
  locale: string,
): readonly (string | number)[] {
  if (!(categoryAxis instanceof SkyChartAxisCategoryTime)) {
    return categoryAxis.categories();
  }

  const unit = categoryAxis.timeUnit();

  return getChartLabels(categoryAxis).map((time) =>
    formatTimeCategory(time as number, unit, locale),
  );
}
