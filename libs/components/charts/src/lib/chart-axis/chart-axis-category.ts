import {
  booleanAttribute,
  Component,
  computed,
  inject,
  input,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { SkyAppLocaleProvider, SkyLibResourcesService } from '@skyux/i18n';

import { map } from 'rxjs/operators';

import { formatTimeCategory } from '../chart-js/chart-js-date-adapter';

import { type SkyChartCategoryScaleType } from '../shared/category-scale-type';
import { SkyChartsResourcesModule } from '../shared/sky-charts-resources.module';
import { parseTimeCategory } from '../shared/time-category-parser';
import { type SkyChartTimeUnit } from '../shared/time-unit';

import { optionalNumberAttribute } from './optional-number-attribute';

/**
 * Defines the category axis of a chart. Its categories are shared by every
 * series plotted against it, and each series' values align to them by index.
 * @preview
 */
@Component({
  selector: 'sky-chart-axis-category',
  imports: [SkyChartsResourcesModule],
  template: '',
})
export class SkyChartAxisCategory {
  readonly #localeProvider = inject(SkyAppLocaleProvider);
  readonly #resourcesSvc = inject(SkyLibResourcesService);

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
   * labels and tooltips format dates. Required when `scaleType` is `time`.
   */
  public readonly timeUnit = input<SkyChartTimeUnit>();

  /**
   * The number of `timeUnit`s between labels on a `time` scale, as a positive
   * whole number. Labels that would overlap are skipped.
   * @default 1
   */
  public readonly timeStep = input(undefined, {
    transform: optionalNumberAttribute,
  });

  /**
   * The current locale.
   * @internal
   */
  public readonly locale = toSignal(
    this.#localeProvider.getLocaleInfo().pipe(map((info) => info.locale)),
    { initialValue: this.#localeProvider.defaultLocale },
  );

  /**
   * The quarter label resource string for the current locale.
   * @internal
   */
  public readonly quarterLabel = computed(() =>
    this.#resourcesSvc.getStringForLocale(
      { locale: this.locale() },
      'skyux_charts.time_scale.quarter_label',
    ),
  );

  /**
   * The categories as Chart.js labels.
   * @internal
   */
  public readonly chartLabels = computed<readonly (string | number)[]>(() => {
    const categories = this.categories();

    if (this.scaleType() === 'time') {
      this.#requireTimeUnit();
      this.#validateTimeStep();

      return categories.map(parseTimeCategory);
    }

    return categories;
  });

  /**
   * The categories as the data table shows them.
   * @internal
   */
  public readonly displayCategories = computed<readonly (string | number)[]>(
    () => {
      const labels = this.chartLabels();

      if (this.scaleType() !== 'time') {
        return labels;
      }

      const unit = this.#requireTimeUnit();
      const locale = this.locale();

      return labels.map((time) =>
        formatTimeCategory(time as number, unit, locale),
      );
    },
  );

  #requireTimeUnit(): SkyChartTimeUnit {
    const unit = this.timeUnit();

    if (!unit) {
      throw new Error(
        'The <sky-chart-axis-category> must have a "timeUnit" when its ' +
          '"scaleType" is "time".',
      );
    }

    return unit;
  }

  // Chart.js loops forever on a step that does not advance the date.
  #validateTimeStep(): void {
    const step = this.timeStep();

    if (step !== undefined && !(Number.isInteger(step) && step > 0)) {
      throw new Error(
        `The <sky-chart-axis-category> has a "timeStep" of "${step}", but it ` +
          'must be a positive whole number.',
      );
    }
  }
}
