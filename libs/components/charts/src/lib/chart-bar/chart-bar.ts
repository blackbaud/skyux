import {
  afterRenderEffect,
  ChangeDetectionStrategy,
  Component,
  contentChild,
  contentChildren,
  DestroyRef,
  ElementRef,
  inject,
  input,
  viewChild,
} from '@angular/core';
import { SkyLogService } from '@skyux/core';
import Chart, {
  type ChartConfiguration,
  type ChartDataset,
  type TooltipItem,
} from 'chart.js/auto';

import { SkyChartCategoryAxis } from '../chart-axes/chart-category-axis';
import { SkyChartValueAxis } from '../chart-axes/chart-value-axis';
import { SkyChartSeries } from '../chart-series/chart-series';
import { SkyChartTable } from '../chart/chart-table';
import { SkyChartTableService } from '../chart/chart-table.service';
import { SkyChartBarOrientation } from './chart-bar-orientation';

type BarChartScales = NonNullable<
  NonNullable<ChartConfiguration<'bar'>['options']>['scales']
>;

type BarChartConfig = ChartConfiguration<'bar'> & {
  options: NonNullable<ChartConfiguration<'bar'>['options']>;
};

const CATEGORY_AXIS_ID = 'category';

/**
 * @preview
 */
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [],
  selector: 'sky-chart-bar',
  // Chart.js detects size changes from the canvas's parent, not the canvas
  // itself, so the host must be a dedicated, relatively-positioned container
  // for the canvas. Without this, the chart fails to resize responsively and
  // can render blurry or continually shrink.
  // https://www.chartjs.org/docs/latest/configuration/responsive.html#important-note
  styles: `
    :host {
      display: block;
      position: relative;
    }
  `,
  template: `<canvas #chartRef aria-hidden="true"></canvas>`,
})
export class SkyChartBar {
  readonly #logSvc = inject(SkyLogService);

  /**
   * The orientation of the bars.
   * @default 'vertical'
   */
  public readonly orientation = input<SkyChartBarOrientation>('vertical');

  protected readonly chartRef = viewChild.required('chartRef', {
    read: ElementRef,
  });

  protected readonly categoryAxis = contentChild(SkyChartCategoryAxis);
  protected readonly valueAxes = contentChildren(SkyChartValueAxis);
  protected readonly series = contentChildren(SkyChartSeries);

  #chart: Chart<'bar'> | undefined;

  constructor() {
    const tableSvc = inject(SkyChartTableService, { optional: true });

    inject(DestroyRef).onDestroy(() => {
      this.#chart?.destroy();
      this.#chart = undefined;
      tableSvc?.table.set(undefined);
    });

    afterRenderEffect(() => {
      tableSvc?.table.set(this.#buildTable());

      const config = this.#buildConfig();

      if (!config) {
        return;
      }

      if (this.#chart) {
        this.#chart.data = config.data;
        this.#chart.options = config.options;
        this.#chart.update();
      } else {
        this.#chart = new Chart(this.chartRef().nativeElement, config);
      }
    });
  }

  #buildTable(): SkyChartTable | undefined {
    const categoryAxis = this.categoryAxis();
    const valueAxes = this.valueAxes();
    const series = this.series();

    if (!categoryAxis || valueAxes.length === 0 || series.length === 0) {
      return undefined;
    }

    return {
      categoryLabel: categoryAxis.labelText(),
      categories: categoryAxis.categories(),
      series: series.map((chartSeries) => {
        const formatValue = this.#valueAxisForSeries(
          chartSeries,
          valueAxes,
        ).formatValue();

        return {
          label: chartSeries.labelText(),
          values: chartSeries.values().map((value) => formatValue(value)),
        };
      }),
    };
  }

  #valueAxisForSeries(
    chartSeries: SkyChartSeries,
    valueAxes: readonly SkyChartValueAxis[],
  ): SkyChartValueAxis {
    const wanted = chartSeries.valueAxis();
    const match = wanted
      ? valueAxes.find((axis) => axis.axisId() === wanted)
      : undefined;

    return match ?? valueAxes[0];
  }

  #buildConfig(): BarChartConfig | undefined {
    const categoryAxis = this.categoryAxis();
    const valueAxes = this.valueAxes();
    const series = this.series();

    if (!categoryAxis || valueAxes.length === 0 || series.length === 0) {
      return undefined;
    }

    const isHorizontal = this.orientation() === 'horizontal';
    const indexAxis = isHorizontal ? 'y' : 'x';
    const valueDirection = isHorizontal ? 'x' : 'y';

    // Resolve each value axis to a stable scale key.
    const valueAxisKeys = valueAxes.map(
      (axis, index) => axis.axisId() ?? `value-${index}`,
    );

    const scales: BarChartScales = {
      [CATEGORY_AXIS_ID]: {
        type: 'category',
        axis: indexAxis,
        position: isHorizontal ? 'left' : 'bottom',
        title: {
          display: !categoryAxis.labelHidden(),
          text: categoryAxis.labelText(),
        },
      },
    };

    valueAxes.forEach((axis, index) => {
      const isSecondary = index > 0;
      const formatValue = axis.formatValue();

      scales[valueAxisKeys[index]] = {
        type: 'linear',
        axis: valueDirection,
        position: isHorizontal
          ? isSecondary
            ? 'top'
            : 'bottom'
          : isSecondary
            ? 'right'
            : 'left',
        title: {
          display: !axis.labelHidden(),
          text: axis.labelText(),
        },
        // Prevent multiple value axes from stacking grid lines on top of
        // each other.
        grid: { drawOnChartArea: !isSecondary },
        ticks: {
          callback: (tickValue: string | number): string =>
            formatValue(Number(tickValue)),
        },
      };
    });

    const datasetFormatters: ((value: number) => string)[] = [];

    const datasets = series.map((chartSeries): ChartDataset<'bar'> => {
      const wanted = chartSeries.valueAxis();
      let matchedIndex = -1;

      if (wanted) {
        matchedIndex = valueAxes.findIndex((axis) => axis.axisId() === wanted);

        if (matchedIndex === -1) {
          this.#logSvc.warn(
            `The chart series "${chartSeries.labelText()}" specifies valueAxis ` +
              `"${wanted}", which does not match any value axis. The series will ` +
              `plot against the first value axis.`,
          );
        }
      }

      const resolvedIndex = matchedIndex === -1 ? 0 : matchedIndex;
      const valueKey = valueAxisKeys[resolvedIndex];

      datasetFormatters.push(valueAxes[resolvedIndex].formatValue());

      const dataset: ChartDataset<'bar'> = {
        label: chartSeries.labelText(),
        data: chartSeries.values(),
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

    return {
      type: 'bar',
      data: {
        labels: categoryAxis.categories(),
        datasets,
      },
      options: {
        indexAxis,
        scales,
        plugins: {
          tooltip: {
            callbacks: {
              label: (context: TooltipItem<'bar'>): string => {
                const formatValue = datasetFormatters[context.datasetIndex];
                const formatted = formatValue(
                  context.parsed[valueDirection] ?? 0,
                );
                const label = context.dataset.label;

                return label ? `${label}: ${formatted}` : formatted;
              },
            },
          },
        },
      },
    };
  }
}
