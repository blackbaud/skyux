import {
  afterRenderEffect,
  ChangeDetectionStrategy,
  Component,
  computed,
  contentChild,
  contentChildren,
  inject,
  input,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { SkyLogService } from '@skyux/core';
import { SkyThemeService } from '@skyux/theme';
import { type ChartDataset } from 'chart.js/auto';
import { EMPTY, map } from 'rxjs';

import { SkyChartAxisCategory } from '../chart-axis/chart-axis-category';
import { SkyChartAxisValue } from '../chart-axis/chart-axis-value';
import {
  buildCartesianScales,
  buildCartesianTable,
  buildValueTooltipLabel,
  CATEGORY_AXIS_ID,
  resolveCartesianData,
  VALUE_AXIS_ID,
} from '../chart-js/cartesian-utils';
import { SkyChartJs, type SkyChartJsConfig } from '../chart-js/chart-js';
import { extendBaseChartJsConfig } from '../chart-js/chart-js-config-utils';
import { SkyChartPlot } from '../chart-plot/chart-plot';
import { SkyChartTable } from '../chart-table/chart-table';
import { SkyChartAccessibleSummary } from '../chart-table/chart-table-service';
import { type SkyChartThemeStyles } from '../shared/chart-theme-styles';
import { SkyChartBarOrientation } from './chart-bar-orientation';
import { SkyChartBarSeries } from './chart-bar-series';
import { SkyChartBarSeriesLayout } from './chart-bar-series-layout';

/**
 * Renders a bar chart from a category axis, a value axis, and one or more
 * series.
 *
 * @preview
 */
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SkyChartJs],
  selector: 'sky-chart-bar',
  templateUrl: './chart-bar.html',
})
export class SkyChartBar extends SkyChartPlot {
  readonly #themeSettings = toSignal(
    inject(SkyThemeService, { optional: true })?.settingsChange.pipe(
      map((change) => change.currentSettings),
    ) ?? EMPTY,
    { initialValue: undefined },
  );

  /**
   * The orientation of the bars.
   * @default 'vertical'
   */
  public readonly orientation = input<SkyChartBarOrientation>('vertical');

  /**
   * How the bars of multiple series are arranged within each category.
   * `grouped` places the series' bars side by side; `stacked` accumulates the
   * bars into a single bar per category. When `stacked`, assign each series a
   * `stackId` value to subdivide the bar into side-by-side stacks (grouped,
   * stacked bars). This has no visible effect when the chart has a single
   * series.
   * @default 'grouped'
   */
  public readonly seriesLayout = input<SkyChartBarSeriesLayout>('grouped');

  protected readonly categoryAxis = contentChild(SkyChartAxisCategory);
  protected readonly valueAxis = contentChild(SkyChartAxisValue);
  protected readonly series = contentChildren(SkyChartBarSeries);

  constructor() {
    super();

    const logger = inject(SkyLogService);

    // Values align to categories by index, so a length mismatch silently
    // misaligns or drops data. Warn about the one alignment mistake that is
    // mechanically detectable.
    afterRenderEffect(() => {
      const categoryCount = this.categoryAxis()?.categories().length;

      if (categoryCount === undefined) {
        return;
      }

      for (const chartSeries of this.series()) {
        const valueCount = chartSeries.values().length;

        if (valueCount !== categoryCount) {
          logger.warn(
            `The <sky-chart-bar-series> labeled "${chartSeries.labelText()}" ` +
              `has ${valueCount} values, but the category axis has ` +
              `${categoryCount} categories. Values align to categories by ` +
              'index, so each series must provide one value per category.',
          );
        }
      }
    });
  }

  protected readonly chartJsConfig = computed(() => this.#getChartJsConfig());

  /**
   * The height to apply to the rendered chart. Chart.js runs with
   * `maintainAspectRatio: false`, so its container must be given an explicit
   * height. Vertical charts use the themed default; horizontal charts grow
   * with their content so every bar stays legible.
   */
  protected readonly chartHeight = computed(() => this.#getChartHeight());

  protected override getChartTable(): SkyChartTable | undefined {
    const data = resolveCartesianData(
      this.categoryAxis(),
      this.valueAxis(),
      this.series(),
    );

    if (!data) {
      return undefined;
    }

    return buildCartesianTable(
      data.categoryAxis,
      data.series,
      data.valueAxis.formatValue(),
    );
  }

  protected override getAccessibleSummary():
    | SkyChartAccessibleSummary
    | undefined {
    const data = resolveCartesianData(
      this.categoryAxis(),
      this.valueAxis(),
      this.series(),
    );

    if (!data) {
      return undefined;
    }

    return {
      resourceKey: 'skyux_charts.chart.bar.accessible_summary',
      args: [data.series.length, data.categoryAxis.categories().length],
    };
  }

  #getChartJsConfig(): SkyChartJsConfig<'bar'> | undefined {
    const data = resolveCartesianData(
      this.categoryAxis(),
      this.valueAxis(),
      this.series(),
    );

    if (!data) {
      return undefined;
    }

    const { categoryAxis, valueAxis, series } = data;

    // Read the theme signal so the config rebuilds when the theme changes,
    // then resolve the themed CSS custom properties to concrete values.
    this.#themeSettings();

    const themeStyles = this.getThemeStyles();
    const categorical = themeStyles.series.categoricalPalette;

    const isHorizontal = this.orientation() === 'horizontal';
    const isStacked = this.seriesLayout() === 'stacked';
    const indexAxis = isHorizontal ? 'y' : 'x';
    const valueDirection = isHorizontal ? 'x' : 'y';
    const formatValue = valueAxis.formatValue();

    // Horizontal bars are rendered at an explicit thickness (see below), which
    // the container height is also derived from; resolve it once so the two
    // always agree.
    const horizontalBarThickness = isHorizontal
      ? this.#getHorizontalBarSpacing(themeStyles).barThickness
      : undefined;

    // Vertical bars fill their responsive width; the fill percentages are
    // tuned by category count (see below).
    const verticalSpacing = isHorizontal
      ? undefined
      : this.#getVerticalBarElementSpacing(categoryAxis.categories().length);

    const datasets = series.map((chartSeries, index): ChartDataset<'bar'> => {
      const dataset: ChartDataset<'bar'> = {
        label: chartSeries.labelText(),
        // Chart.js mutates the arrays it is given, so copy the readonly input.
        data: [...chartSeries.values()],
        backgroundColor: categorical[index % categorical.length],
      };

      if (isHorizontal) {
        // Render bars at the exact thickness the container height was computed
        // for. Without this, Chart.js shrinks each bar to a fraction of its
        // category slot, ignoring the minimum thickness.
        dataset.barThickness = horizontalBarThickness;
      } else {
        // Shape the whitespace around vertical bars and cap their width so
        // sparse charts do not render unusably wide bars.
        dataset.categoryPercentage = verticalSpacing?.categoryPercentage;
        dataset.barPercentage = verticalSpacing?.barPercentage;
        dataset.maxBarThickness = themeStyles.bar.vertical.maxBarThickness;
      }

      // Stack groups only apply to a stacked layout; on a grouped layout the
      // scales are not stacked, so a shared stack id would overlap bars instead
      // of accumulating them.
      const stackId = chartSeries.stackId();

      if (isStacked && stackId !== undefined) {
        dataset.stack = stackId;
      }

      if (isHorizontal) {
        dataset.xAxisID = VALUE_AXIS_ID;
        dataset.yAxisID = CATEGORY_AXIS_ID;
      } else {
        dataset.yAxisID = VALUE_AXIS_ID;
        dataset.xAxisID = CATEGORY_AXIS_ID;
      }

      return dataset;
    });

    return extendBaseChartJsConfig<'bar'>(themeStyles, {
      type: 'bar',
      data: {
        // Chart.js mutates the arrays it is given, so copy the readonly input.
        labels: [...categoryAxis.categories()],
        datasets,
      },
      options: {
        interaction: {
          // Index hits along the category axis's direction (see the category scale's
          // `axis` in buildCartesianScales); this is a cartesian direction, not a scale ID.
          axis: isHorizontal ? 'y' : 'x',
        },
        elements: {
          bar: {
            borderWidth: 1,
            borderColor: themeStyles.bar.borderColor,
            borderRadius: themeStyles.bar.borderRadius,
          },
        },
        indexAxis,
        scales: buildCartesianScales({
          categoryAxis,
          valueAxis,
          isHorizontal,
          isStacked,
          themeStyles,
        }),
        plugins: {
          legend: {
            // Show the legend only when there are multiple series to
            // distinguish; a single-series chart's legend is redundant.
            display: datasets.length > 1,
          },
          tooltip: {
            callbacks: {
              label: buildValueTooltipLabel<'bar'>(formatValue, valueDirection),
            },
          },
        },
      },
    });
  }

  /**
   * Resolves the height to apply to the chart container. A vertical chart uses
   * the themed default height. A horizontal chart grows with its content:
   * every category needs enough room for its bars, so the height is derived
   * from the bar count and clamped to the minimum so small charts stay legible.
   */
  #getChartHeight(): string {
    const themeStyles = this.getThemeStyles();

    if (this.orientation() !== 'horizontal') {
      return themeStyles.height.default;
    }

    const { barThickness, categoryGap, categoryCount, barsPerCategory } =
      this.#getHorizontalBarSpacing(themeStyles);
    const rowHeight = barThickness * barsPerCategory + categoryGap;
    const totalRowsHeight = categoryCount * rowHeight;

    const computedHeight =
      this.#computeChartOverhead(themeStyles) + totalRowsHeight;

    // Horizontal charts may grow without bound, but never shrink below the
    // themed minimum.
    const clampedHeight = Math.max(themeStyles.height.min, computedHeight);

    return `${clampedHeight}px`;
  }

  /**
   * Resolves the horizontal bar layout — the per-bar thickness, the gap between
   * categories, and the counts they derive from — shared by the container
   * height and the datasets so the two always agree.
   */
  #getHorizontalBarSpacing(themeStyles: SkyChartThemeStyles): {
    barThickness: number;
    categoryGap: number;
    categoryCount: number;
    barsPerCategory: number;
  } {
    const seriesCount = this.series().length;
    // Chart.js renders one row per category-axis label, so the row count must
    // come from the category axis — a sparse series with fewer values than
    // categories must not shrink the height. The axis is always present when
    // the chart (and therefore this height) renders, so the fallback is
    // defensive only.
    /* istanbul ignore next */
    const categoryCount = this.categoryAxis()?.categories().length ?? 0;

    // A stacked layout renders one bar per distinct stack group — series that
    // share a stack group (or all lack one) accumulate into a single bar — so
    // the number of bars per category is the count of distinct stacks, not one.
    const barsPerCategory =
      this.seriesLayout() === 'stacked'
        ? new Set(this.series().map((chartSeries) => chartSeries.stackId()))
            .size
        : seriesCount;
    const totalBars = categoryCount * barsPerCategory;

    return {
      ...this.#computeHorizontalBarElementSpacing(totalBars, themeStyles),
      categoryCount,
      barsPerCategory,
    };
  }

  /**
   * Derives the per-bar thickness and the gap between categories for a
   * horizontal chart. Charts with few bars use the full bar thickness and a
   * tight gap; as the bar count grows the bars taper toward the minimum
   * thickness while the gap widens so grouped bars stay visually separated.
   */
  #computeHorizontalBarElementSpacing(
    totalBars: number,
    themeStyles: SkyChartThemeStyles,
  ): { barThickness: number; categoryGap: number } {
    const { minBarThickness, maxBarThickness, minCategoryGap } =
      themeStyles.bar.horizontal;

    const taperingStart = 12;
    const taperingStop = 36;
    const lowCategoryGapPercentage = 0.375;
    const highCategoryGapPercentage = 0.75;

    if (totalBars < taperingStart) {
      // Few bars: use the full thickness and target a fraction of the bar
      // width for the gap. No minimum is applied because the bars are already
      // at their full thickness.
      return {
        barThickness: maxBarThickness,
        categoryGap: maxBarThickness * lowCategoryGapPercentage,
      };
    }

    // Many bars: taper the thickness toward the minimum and widen the gap so
    // grouped bars stay separated, but never below the minimum category gap.
    const taperRange = taperingStop - taperingStart;
    const taperFraction = Math.min(1, (totalBars - taperingStart) / taperRange);
    const thicknessRange = maxBarThickness - minBarThickness;
    const taperedThickness = Math.round(
      maxBarThickness - taperFraction * thicknessRange,
    );
    const barThickness = Math.max(minBarThickness, taperedThickness);

    return {
      barThickness,
      categoryGap: Math.max(
        minCategoryGap,
        barThickness * highCategoryGapPercentage,
      ),
    };
  }

  /**
   * Tunes the category and bar fill percentages for a vertical chart. Vertical
   * bars fill their responsive width up to `bar.vertical.maxBarThickness`, so
   * these percentages shape the surrounding whitespace: sparse charts keep the
   * bars near the base width with room around them, while dense charts widen
   * the fill so bars use the available width (approaching the minimum). Chart.js
   * has no minimum-thickness option, so the base and minimum widths are soft
   * targets rather than hard pixel constraints.
   */
  #getVerticalBarElementSpacing(categoryCount: number): {
    categoryPercentage: number;
    barPercentage: number;
  } {
    const barPercentage = 0.85;
    const categoryPercentage =
      categoryCount <= 3 ? 0.4 : categoryCount >= 12 ? 0.95 : 0.7;

    return { categoryPercentage, barPercentage };
  }

  /**
   * Estimates the fixed vertical space a horizontal chart needs outside its
   * plotted rows: the bottom value axis (its tick marks, a row of tick labels,
   * and its title) plus the legend row when multiple series are shown. Added
   * to the rows' height, this keeps the plotted area sized to its bars rather
   * than absorbing the chrome.
   */
  #computeChartOverhead(themeStyles: SkyChartThemeStyles): number {
    const { axis, font, text, tooltip } = themeStyles;
    const lineHeight = font.size * text.lineHeight;

    // Bottom value axis: tick marks, a row of tick labels, and the axis title.
    const valueAxisHeight =
      axis.tickLength + lineHeight + axis.titleGap + lineHeight;

    // The legend only renders with multiple series.
    const legendHeight =
      this.series().length > 1
        ? Math.max(tooltip.iconSize, lineHeight) + axis.titleGap
        : 0;

    return valueAxisHeight + legendHeight;
  }
}
