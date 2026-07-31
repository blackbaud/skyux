import {
  afterRenderEffect,
  ChangeDetectionStrategy,
  Component,
  computed,
  contentChild,
  contentChildren,
  inject,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { SkyLogService } from '@skyux/core';
import { SkyThemeService } from '@skyux/theme';
import { type ChartDataset } from 'chart.js';
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
export class SkyChartLine extends SkyChartPlot {
  readonly #themeSettings = toSignal(
    inject(SkyThemeService, { optional: true })?.settingsChange.pipe(
      map((change) => change.currentSettings),
    ) ?? EMPTY,
    { initialValue: undefined },
  );

  protected readonly categoryAxis = contentChild(SkyChartAxisCategory);
  protected readonly valueAxis = contentChild(SkyChartAxisValue);
  protected readonly series = contentChildren(SkyChartLineSeries);

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
            `The <sky-chart-line-series> labeled "${chartSeries.labelText()}" ` +
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
   * height; line charts always use the themed default.
   */
  protected readonly chartHeight = computed(() => {
    // Read the theme signal so the height recomputes when the theme changes.
    this.#themeSettings();

    return this.getThemeStyles().height.default;
  });

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
    SkyChartAccessibleSummary | undefined {
    const data = resolveCartesianData(
      this.categoryAxis(),
      this.valueAxis(),
      this.series(),
    );

    if (!data) {
      return undefined;
    }

    return {
      resourceKey: 'skyux_charts.chart.line.accessible_summary',
      args: [data.series.length, data.categoryAxis.categories().length],
    };
  }

  #getChartJsConfig(): SkyChartJsConfig<'line'> | undefined {
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
