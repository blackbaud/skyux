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
import {
  readThemeCategoricalPalette,
  readThemeCssNumber,
  readThemeCssString,
} from '../shared/theme-css-utils';
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
    <sky-chart-js [config]="config" [style.height]="height()" />
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

  /**
   * A CSS height value (e.g. `'400px'`, `'20rem'`, `'50vh'`) for the chart.
   * When unspecified, the chart uses internal sizing logic.
   */
  public readonly height = input<string>();

  protected readonly categoryAxis = contentChild(SkyChartAxisCategory);
  protected readonly valueAxes = contentChildren(SkyChartAxisValue);
  protected readonly series = contentChildren(SkyChartSeries);

  protected readonly config = computed(() => this.#buildConfig());

  protected override buildTable(): SkyChartTable | undefined {
    const categoryAxis = this.categoryAxis();
    const valueAxes = this.valueAxes();
    const series = this.series();

    if (!hasCartesianData(categoryAxis, valueAxes, series)) {
      return undefined;
    }

    return buildCartesianTable(categoryAxis, valueAxes, series);
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

    const styles = this.getThemedStyles();

    const barBorderColor = readThemeCssString(
      styles,
      '--sky-color-background-container-base',
      '#ffffff',
    );

    const barBorderRadius = readThemeCssNumber(
      styles,
      '--sky-border-radius-xs',
      2,
    );

    // Series cycle through the categorical palette so each is distinct. Color
    // is the only visual channel that separates series in the rendered canvas;
    // this reliance is intentional. Sighted users get the series names from the
    // legend and tooltips, and assistive-technology users get every data point
    // from the accessible data table (reachable from the chart's context menu
    // and announced by the figure's summary), which is the keyboard/AT view of
    // individual values. Revisit non-color differentiation only if user testing
    // surfaces a need.
    const categorical = readThemeCategoricalPalette(styles);

    const isHorizontal = this.orientation() === 'horizontal';
    const indexAxis = isHorizontal ? 'y' : 'x';
    const valueDirection = isHorizontal ? 'x' : 'y';
    const valueAxisKeys = getValueAxisScaleKeys(valueAxes);

    const bindings = resolveSeriesBindings({
      series,
      valueAxes,
      valueAxisKeys,
      warn: (message) => this.#logSvc.warn(message),
    });

    const datasets = series.map((chartSeries, index): ChartDataset<'bar'> => {
      const { valueKey } = bindings[index];

      const dataset: ChartDataset<'bar'> = {
        label: chartSeries.labelText(),
        data: chartSeries.values(),
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

    return extendBaseChartJsConfig<'bar'>(styles, {
      type: 'bar',
      data: {
        labels: categoryAxis.categories(),
        datasets,
      },
      options: {
        elements: {
          bar: {
            borderWidth: 1,
            borderColor: barBorderColor,
            borderRadius: barBorderRadius,
          },
        },
        indexAxis,
        scales: buildCartesianScales({
          categoryAxis,
          valueAxes,
          valueAxisKeys,
          isHorizontal,
          stacked: this.seriesLayout() === 'stacked',
          styles,
        }),
        plugins: {
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
