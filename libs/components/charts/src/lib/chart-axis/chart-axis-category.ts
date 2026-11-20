import {
  booleanAttribute,
  Component,
  computed,
  inject,
  input,
  numberAttribute,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { SkyAppLocaleProvider, SkyLibResourcesService } from '@skyux/i18n';

import { map } from 'rxjs/operators';

import { formatTimeCategory } from '../chart-js/chart-js-date-adapter';

import { type SkyChartCategoryScaleType } from '../shared/category-scale-type';
import { SkyChartsResourcesModule } from '../shared/sky-charts-resources.module';
import { parseTimeCategory } from '../shared/time-category-parser';
import { type SkyChartTimeUnit } from '../shared/time-unit';

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
   * Why the time options can't be plotted, if they can't.
   * @internal
   */
  public readonly timeScaleError = computed((): string | undefined => {
    const unit = this.timeUnit();
    const step = this.timeStep();

    if (this.scaleType() !== 'time') {
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

    const invalid = this.categories().find((category) =>
      Number.isNaN(parseTimeCategory(category)),
    );

    return invalid === undefined
      ? undefined
      : `The time category "${String(invalid)}" is not a valid date. Time ` +
          'categories must be ISO 8601 date or date-time strings, such as ' +
          '"2026-01-15" or "2026-01-15T10:30:00Z".';
  });

  /**
   * The categories as Chart.js labels.
   * @internal
   */
  public readonly chartLabels = computed<readonly (string | number)[]>(() => {
    const categories = this.categories();

    return this.scaleType() === 'time'
      ? categories.map(parseTimeCategory)
      : categories;
  });

  /**
   * The categories as the data table shows them.
   * @internal
   */
  public readonly displayCategories = computed<readonly (string | number)[]>(
    () => {
      const labels = this.chartLabels();
      const unit = this.timeUnit();

      if (this.scaleType() !== 'time' || !unit) {
        return labels;
      }

      const locale = this.locale();
      const quarterLabel = this.quarterLabel();

      return labels.map((time) =>
        formatTimeCategory(time as number, unit, locale, quarterLabel),
      );
    },
  );
}
