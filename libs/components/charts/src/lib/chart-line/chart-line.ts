import {
  ChangeDetectionStrategy,
  Component,
  computed,
  contentChildren,
} from '@angular/core';
import { type ChartDataset } from 'chart.js';

import {
  buildCartesianScales,
  buildValueTooltipLabel,
  CATEGORY_AXIS_ID,
  VALUE_AXIS_ID,
} from '../chart-js/cartesian-utils';
import { SkyChartJs, type SkyChartJsConfig } from '../chart-js/chart-js';
import { extendBaseChartJsConfig } from '../chart-js/chart-js-config-utils';
import { SkyChartCartesianPlot } from '../chart-plot/chart-cartesian-plot';
import { SkyChartLineSeries } from './chart-line-series';

/**
 * Renders a line chart from a category axis, a value axis, and one or more
 * series.
 *
 * @preview
 */
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SkyChartJs],
  selector: 'sky-chart-line',
  templateUrl: './chart-line.html',
})
export class SkyChartLine extends SkyChartCartesianPlot<SkyChartLineSeries> {
  protected override readonly series = contentChildren(SkyChartLineSeries);
  protected override readonly seriesSelector = 'sky-chart-line-series';
  protected override readonly accessibleSummaryResourceKey =
    'skyux_charts.chart.line.accessible_summary';

  protected readonly chartJsConfig = computed(() => this.#getChartJsConfig());

  /**
   * The height to apply to the rendered chart. Chart.js runs with
   * `maintainAspectRatio: false`, so its container must be given an explicit
   * height; line charts always use the themed default.
   */
  protected readonly chartHeight = computed(() => {
    // Read the theme signal so the height recomputes when the theme changes.
    this.themeSettings();

    return this.getThemeStyles().height.default;
  });

  #getChartJsConfig(): SkyChartJsConfig<'line'> | undefined {
    const data = this.getCartesianData();

    if (!data) {
      return undefined;
    }

    const { categoryAxis, valueAxis, series } = data;

    // Read the theme signal so the config rebuilds when the theme changes,
    // then resolve the themed CSS custom properties to concrete values.
    this.themeSettings();

    const themeStyles = this.getThemeStyles();
    const categorical = themeStyles.series.categoricalPalette;
    const formatValue = valueAxis.formatValue();

    const datasets = series.map((chartSeries, index): ChartDataset<'line'> => {
      const color = categorical[index % categorical.length];

      return {
        label: chartSeries.labelText(),
        // Chart.js mutates the arrays it is given, so copy the readonly input.
        data: [...chartSeries.values()],
        borderColor: color,
        // The background colors the points and the legend's swatch; the line
        // itself is drawn from the border color.
        backgroundColor: color,
        xAxisID: CATEGORY_AXIS_ID,
        yAxisID: VALUE_AXIS_ID,
      };
    });

    return extendBaseChartJsConfig<'line'>(themeStyles, {
      type: 'line',
      data: {
        // Chart.js mutates the arrays it is given, so copy the readonly input.
        labels: [...categoryAxis.categories()],
        datasets,
      },
      options: {
        interaction: {
          // Index hits along the category axis's direction (see the category
          // scale's `axis` in buildCartesianScales); this is a cartesian
          // direction, not a scale ID.
          axis: 'x',
        },
        elements: {
          line: {
            borderWidth: 2,
          },
          point: {
            radius: 3,
            hoverRadius: 5,
          },
        },
        scales: buildCartesianScales({
          categoryAxis,
          valueAxis,
          isHorizontal: false,
          // Line charts render the full background grid: unlike bars, points
          // float in open space, so category grid lines anchor them.
          showCategoryGridLines: true,
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
              label: buildValueTooltipLabel<'line'>(formatValue, 'y'),
            },
          },
        },
      },
    });
  }
}
