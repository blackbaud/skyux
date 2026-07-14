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
import { SkyLogService } from '@skyux/core';
import { SkyThemeService } from '@skyux/theme';
import { type ChartDataset } from 'chart.js/auto';
import { EMPTY, map } from 'rxjs';

import { SkyChartAxisCategory } from '../chart-axes/chart-axis-category';
import { SkyChartAxisValue } from '../chart-axes/chart-axis-value';
import { SkyChartSeries } from '../chart-series/chart-series';
import { SkyChartTable } from '../chart-table/chart-table';
import { SkyChartAccessibleSummary } from '../chart-table/chart-table-service';
import {
  buildCartesianScales,
  buildCartesianTable,
  buildValueTooltipLabel,
  CATEGORY_AXIS_ID,
  getValueAxisScaleKeys,
  hasCartesianData,
  resolveSeriesBindings,
} from '../shared/cartesian-utils';
import { SkyChartJs, type SkyChartJsConfig } from '../shared/chart-js';
import { extendBaseChartJsConfig } from '../shared/chart-js-config-utils';
import { SkyChartPlot } from '../shared/chart-plot';
import { SkyChartBarOrientation } from './chart-bar-orientation';
import { SkyChartBarSeriesLayout } from './chart-bar-series-layout';

/**
 * Renders a bar chart from a category axis, one or more value axes, and one or
 * more series.
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
  readonly #logSvc = inject(SkyLogService);

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
   * bars of series that share a value axis into a single bar per category.
   * This has no visible effect when the chart has a single series.
   * @default 'grouped'
   */
  public readonly seriesLayout = input<SkyChartBarSeriesLayout>('grouped');

  protected readonly categoryAxis = contentChild(SkyChartAxisCategory);
  protected readonly valueAxes = contentChildren(SkyChartAxisValue);
  protected readonly series = contentChildren(SkyChartSeries);

  // Resolved once and shared by the chart config and the accessible data
  // table so each series' value axis is matched a single time.
  readonly #seriesBindings = computed(() => {
    const valueAxes = this.valueAxes();

    return resolveSeriesBindings({
      series: this.series(),
      valueAxes,
      valueAxisKeys: getValueAxisScaleKeys(valueAxes),
      warn: (message) => this.#logSvc.warn(message),
    });
  });

  protected readonly config = computed(() => this.#buildConfig());

  protected override buildTable(): SkyChartTable | undefined {
    const categoryAxis = this.categoryAxis();
    const valueAxes = this.valueAxes();
    const series = this.series();

    if (!hasCartesianData(categoryAxis, valueAxes, series)) {
      return undefined;
    }

    return buildCartesianTable(categoryAxis, series, this.#seriesBindings());
  }

  protected override buildSummary(): SkyChartAccessibleSummary | undefined {
    const categoryAxis = this.categoryAxis();
    const valueAxes = this.valueAxes();
    const series = this.series();

    if (!hasCartesianData(categoryAxis, valueAxes, series)) {
      return undefined;
    }

    return {
      resourceKey: 'skyux_charts.chart.bar.accessible_summary',
      args: [series.length, categoryAxis.categories().length],
    };
  }

  #buildConfig(): SkyChartJsConfig<'bar'> | undefined {
    const categoryAxis = this.categoryAxis();
    const valueAxes = this.valueAxes();
    const series = this.series();

    if (!hasCartesianData(categoryAxis, valueAxes, series)) {
      return undefined;
    }

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
    const indexAxis = isHorizontal ? 'y' : 'x';
    const valueDirection = isHorizontal ? 'x' : 'y';
    const valueAxisKeys = getValueAxisScaleKeys(valueAxes);
    const bindings = this.#seriesBindings();

    const datasets = series.map((chartSeries, index): ChartDataset<'bar'> => {
      const { valueKey } = bindings[index];

      const dataset: ChartDataset<'bar'> = {
        label: chartSeries.labelText(),
        // Chart.js mutates the arrays it is given, so copy the readonly input.
        data: [...chartSeries.values()],
        backgroundColor: categorical[index % categorical.length],
      };

      if (isHorizontal) {
        dataset.xAxisID = valueKey;
        dataset.yAxisID = CATEGORY_AXIS_ID;
      } else {
        dataset.yAxisID = valueKey;
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
          valueAxes,
          valueAxisKeys,
          isHorizontal,
          stacked: this.seriesLayout() === 'stacked',
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
              label: buildValueTooltipLabel<'bar'>(
                bindings.map((binding) => binding.formatValue),
                valueDirection,
              ),
            },
          },
        },
      },
    });
  }
}
