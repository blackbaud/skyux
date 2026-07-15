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

import { SkyChartAxisCategory } from '../chart-axes/chart-axis-category';
import { SkyChartAxisValue } from '../chart-axes/chart-axis-value';
import { SkyChartTable } from '../chart-table/chart-table';
import { SkyChartAccessibleSummary } from '../chart-table/chart-table-service';
import {
  buildCartesianScales,
  buildCartesianTable,
  buildValueTooltipLabel,
  CATEGORY_AXIS_ID,
  resolveCartesianData,
  VALUE_AXIS_ID,
} from '../shared/cartesian-utils';
import { SkyChartJs, type SkyChartJsConfig } from '../shared/chart-js';
import { extendBaseChartJsConfig } from '../shared/chart-js-config-utils';
import { SkyChartPlot } from '../shared/chart-plot';
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
  template: `@if (config(); as config) {
    <sky-chart-js [config]="config" />
  }`,
})
export class SkyChartBar extends SkyChartPlot {
  // Chart.js renders to a canvas and cannot read CSS custom properties, so the
  // active theme's values must be resolved against a DOM element. Tracking the
  // theme settings as a signal rebuilds `config` whenever the theme changes.
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
   * `stack` value to subdivide the bar into side-by-side stacks (grouped,
   * stacked bars). This has no visible effect when the chart has a single
   * series.
   * @default 'grouped'
   */
  public readonly seriesLayout = input<SkyChartBarSeriesLayout>('grouped');

  protected readonly categoryAxis = contentChild(SkyChartAxisCategory);
  protected readonly valueAxis = contentChild(SkyChartAxisValue);
  protected readonly series = contentChildren(SkyChartBarSeries);

  protected readonly config = computed(() => this.#buildConfig());

  protected override buildTable(): SkyChartTable | undefined {
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

  protected override buildSummary(): SkyChartAccessibleSummary | undefined {
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

  #buildConfig(): SkyChartJsConfig<'bar'> | undefined {
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

    // Series cycle through the categorical palette so each is distinct. Color
    // is the only visual channel that separates series in the rendered canvas;
    // this reliance is intentional. Sighted users get the series names from the
    // legend and tooltips, and assistive-technology users get every data point
    // from the accessible data table (reachable from the chart's context menu
    // and announced by the figure's summary), which is the keyboard/AT view of
    // individual values. Revisit non-color differentiation only if user testing
    // surfaces a need.
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
      const stack = chartSeries.stack();

      if (isStacked && stack !== undefined) {
        dataset.stack = stack;
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
          stacked: isStacked,
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
