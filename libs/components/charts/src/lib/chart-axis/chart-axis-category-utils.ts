import { formatTimeCategory } from '../chart-js/chart-js-date-adapter';
import { parseTimeCategory } from '../shared/time-category-parser';

import { type SkyChartAxisCategory } from './chart-axis-category';

/**
 * Explains why a category axis's time options can't be plotted, if they
 * can't.
 * @internal
 */
export function getTimeScaleError(
  categoryAxis: SkyChartAxisCategory,
): string | undefined {
  const unit = categoryAxis.timeUnit();
  const step = categoryAxis.timeStep();

  if (categoryAxis.scaleType() !== 'time') {
    const name =
      unit !== undefined
        ? 'timeUnit'
        : step !== undefined
          ? 'timeStep'
          : undefined;

    return name
      ? `The <sky-chart-axis-category> has a "${name}", which requires a ` +
          '"scaleType" of "time".'
      : undefined;
  }

  if (!unit) {
    return (
      'The <sky-chart-axis-category> must have a "timeUnit" when its ' +
      '"scaleType" is "time".'
    );
  }

  if (step !== undefined && !(Number.isInteger(step) && step > 0)) {
    return (
      `The <sky-chart-axis-category> has a "timeStep" of "${step}", but it ` +
      'must be a positive whole number.'
    );
  }

  const invalid = categoryAxis
    .categories()
    .find((category) => Number.isNaN(parseTimeCategory(category)));

  return invalid === undefined
    ? undefined
    : `The time category "${String(invalid)}" is not a valid date. Time ` +
        'categories must be ISO 8601 date or date-time strings, such as ' +
        '"2026-01-15" or "2026-01-15T10:30:00Z".';
}

/**
 * Gets a category axis's categories as Chart.js labels.
 * @internal
 */
export function getChartLabels(
  categoryAxis: SkyChartAxisCategory,
): readonly (string | number)[] {
  const categories = categoryAxis.categories();

  return categoryAxis.scaleType() === 'time'
    ? categories.map(parseTimeCategory)
    : categories;
}

/**
 * Gets a category axis's categories as the data table shows them.
 * @internal
 */
export function getDisplayCategories(
  categoryAxis: SkyChartAxisCategory,
  locale: string,
): readonly (string | number)[] {
  const labels = getChartLabels(categoryAxis);
  const unit = categoryAxis.timeUnit();

  if (categoryAxis.scaleType() !== 'time' || !unit) {
    return labels;
  }

  return labels.map((time) => formatTimeCategory(time as number, unit, locale));
}
