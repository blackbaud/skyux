import {
  booleanAttribute,
  Component,
  input,
  numberAttribute,
} from '@angular/core';

import { type SkyChartTimeUnit } from '../shared/time-unit';

import { SKY_CHART_CATEGORY_AXIS } from './chart-category-axis-token';

/**
 * Defines a category axis whose categories are dates. Unlike
 * `sky-chart-axis-category`, which spaces categories evenly, it spaces them by
 * the time between them. Supported only by line charts.
 * @preview
 */
@Component({
  selector: 'sky-chart-axis-category-time',
  template: '',
  providers: [
    { provide: SKY_CHART_CATEGORY_AXIS, useExisting: SkyChartAxisCategoryTime },
  ],
})
export class SkyChartAxisCategoryTime {
  /**
   * The dates shared by every series plotted against this axis. Each series'
   * values are aligned to these dates by index. Each date must be an ISO 8601
   * date or date-time string, such as `"2026-01-15"` or
   * `"2026-01-15T10:30:00Z"`. A string without an offset is read in local
   * time.
   */
  public readonly categories = input.required<readonly string[]>();

  /**
   * Whether to hide the axis label.
   */
  public readonly labelHidden = input(false, { transform: booleanAttribute });

  /**
   * The text of the axis label.
   */
  public readonly labelText = input.required<string>();

  /**
   * The number of `timeUnit`s between labels, as a positive whole number.
   * Labels that would overlap are skipped.
   * @default 1
   */
  public readonly timeStep = input(undefined, {
    transform: (value: unknown): number | undefined =>
      value === undefined || value === null
        ? undefined
        : numberAttribute(value),
  });

  /**
   * The unit of time between labels. It also sets how labels and tooltips
   * format dates.
   */
  public readonly timeUnit = input.required<SkyChartTimeUnit>();
}
