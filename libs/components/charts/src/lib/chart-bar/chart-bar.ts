import {
  ChangeDetectionStrategy,
  Component,
  computed,
  contentChild,
  contentChildren,
  inject,
  input,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { SkyThemeService } from '@skyux/theme';
import { type ChartDataset } from 'chart.js/auto';
import { EMPTY, map } from 'rxjs';

import { SkyChartAxisCategory } from '../chart-axis/chart-axis-category';
import { SkyChartAxisMeasure } from '../chart-axis/chart-axis-measure';
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
   * `stackGroup` value to subdivide the bar into side-by-side stacks (grouped,
   * stacked bars). This has no visible effect when the chart has a single
   * series.
   * @default 'grouped'
   */
  public readonly seriesLayout = input<SkyChartBarSeriesLayout>('grouped');

  protected readonly categoryAxis = contentChild(SkyChartAxisCategory);
  protected readonly valueAxis = contentChild(SkyChartAxisMeasure);
  protected readonly series = contentChildren(SkyChartBarSeries);

  protected readonly chartJsConfig = computed(() => this.#getChartJsConfig());

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

    const datasets = series.map((chartSeries, index): ChartDataset<'bar'> => {
      const dataset: ChartDataset<'bar'> = {
        label: chartSeries.labelText(),
        // Chart.js mutates the arrays it is given, so copy the readonly input.
        data: [...chartSeries.values()],
        backgroundColor: categorical[index % categorical.length],
      };

      // Stack groups only apply to a stacked layout; on a grouped layout the
      // scales are not stacked, so a shared stack id would overlap bars instead
      // of accumulating them.
      const stackGroup = chartSeries.stackGroup();

      if (isStacked && stackGroup !== undefined) {
        dataset.stack = stackGroup;
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
}
