import {
  booleanAttribute,
  Component,
  input,
  numberAttribute,
} from '@angular/core';

import { type SkyChartCategoryScaleType } from '../shared/category-scale-type';
import { type SkyChartTimeUnit } from '../shared/time-unit';

/**
 * Defines the category axis of a chart. Its categories are shared by every
 * series plotted against it, and each series' values align to them by index.
 * @preview
 */
@Component({
  selector: 'sky-chart-axis-category',
  template: '',
})
export class SkyChartAxisCategory {
  /**
   * The categories shared by every series plotted against this axis. Each
   * series' values are aligned to these categories by index. On a `time`
   * scale, each category must be an ISO 8601 date or date-time string, such
   * as `"2026-01-15"` or `"2026-01-15T10:30:00Z"`. A string without an offset
   * is read in local time.
   */
  public readonly categories = input.required<readonly (string | number)[]>();

  /**
   * Whether to hide the axis label.
   */
  public readonly labelHidden = input(false, { transform: booleanAttribute });

  /**
   * The text of the axis label.
   */
  public readonly labelText = input.required<string>();

  /**
   * The scale type for the category axis. A `time` scale requires
   * `timeUnit` and is supported only by line charts.
   * @default 'category'
   */
  public readonly scaleType = input<SkyChartCategoryScaleType>('category');

  /**
   * The unit of time between labels on a `time` scale. It also sets how
   * labels and tooltips format dates. Required when `scaleType` is `time`,
   * and only valid then.
   */
  public readonly timeUnit = input<SkyChartTimeUnit>();

  /**
   * The number of `timeUnit`s between labels on a `time` scale, as a positive
   * whole number. Labels that would overlap are skipped. Only valid when
   * `scaleType` is `time`.
   * @default 1
   */
  public readonly timeStep = input(undefined, {
    transform: (value: unknown): number | undefined =>
      value === undefined || value === null
        ? undefined
        : numberAttribute(value),
  });
}
