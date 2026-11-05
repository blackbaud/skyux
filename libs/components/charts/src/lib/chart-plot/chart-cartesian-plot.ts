import {
  afterRenderEffect,
  computed,
  contentChild,
  Directive,
  inject,
  Signal,
  signal,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { SkyLogService } from '@skyux/core';
import { SkyThemeService } from '@skyux/theme';
import { EMPTY, map, Subject } from 'rxjs';

import { SkyChartAxisCategory } from '../chart-axis/chart-axis-category';
import { SkyChartAxisValue } from '../chart-axis/chart-axis-value';
import {
  buildCartesianTable,
  resolveCartesianData,
  type SkyChartCartesianData,
  type SkyChartCartesianSeries,
} from '../chart-js/cartesian-utils';
import { type SkyChartJsDataPointIndex } from '../chart-js/chart-js';
import { type SkyChartLegendItem } from '../chart-legend/chart-legend';
import { SkyChartTable } from '../chart-table/chart-table';
import { SkyChartAccessibleSummary } from '../chart-table/chart-table-service';
import { type SkyChartDataPointClick } from '../shared/chart-data-point-click';
import { SkyChartPlot } from './chart-plot';

/**
 * Base class for cartesian plot components (for example, `sky-chart-bar` and
 * `sky-chart-line`): plots that render one or more series against a category
 * axis and a value axis. Owns the axis content queries, the theme change
 * signal, the accessible table and summary, and the series/category
 * length-mismatch warning. Subclasses supply the series content query, the
 * series selector, the summary resource key, and their own Chart.js config.
 * @internal
 */
@Directive()
export abstract class SkyChartCartesianPlot<
  TSeries extends SkyChartCartesianSeries,
> extends SkyChartPlot {
  readonly #themeSettings = toSignal(
    inject(SkyThemeService, { optional: true })?.settingsChange.pipe(
      map((change) => change.currentSettings),
    ) ?? EMPTY,
    { initialValue: undefined },
  );

  /**
   * The active theme's resolved chart styling. Resolving forces a style
   * recalculation, so it is computed once per theme change and shared.
   */
  protected readonly themeStyles = computed(() => {
    this.#themeSettings();

    return this.getThemeStyles();
  });

  protected readonly categoryAxis = contentChild(SkyChartAxisCategory);
  protected readonly valueAxis = contentChild(SkyChartAxisValue);

  /**
   * The projected series components. Subclasses implement this with a
   * `contentChildren` query for their series component.
   */
  protected abstract readonly series: Signal<readonly TSeries[]>;

  /**
   * The selector of the subclass's series component, named in the
   * length-mismatch warning.
   */
  protected abstract readonly seriesSelector: string;

  /**
   * The resource key of the plot's accessible summary. The message receives
   * the series count and the category count as its arguments.
   */
  protected abstract readonly accessibleSummaryResourceKey: string;

  /**
   * The source of each subclass's `dataPointClick` output. Its `observed` flag
   * tells whether a consumer listens, which decides whether data points
   * present as clickable.
   */
  protected readonly dataPointClickSource =
    new Subject<SkyChartDataPointClick>();

  readonly #hiddenSeries = signal<ReadonlySet<TSeries>>(new Set());

  protected readonly legendItems = computed((): SkyChartLegendItem[] => {
    const palette = this.themeStyles().series.categoricalPalette;

    return this.series().map((chartSeries, index) => ({
      labelText: chartSeries.labelText(),
      color: palette[index % palette.length],
      hidden: this.isSeriesHidden(chartSeries),
    }));
  });

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
            `The <${this.seriesSelector}> labeled ` +
              `"${chartSeries.labelText()}" has ${valueCount} values, but ` +
              `the category axis has ${categoryCount} categories. Values ` +
              'align to categories by index, so each series must provide ' +
              'one value per category.',
          );
        }
      }
    });
  }

  /**
   * Resolves the axes and series into the data the plot needs to render, or
   * `undefined` when a required axis or series is missing.
   */
  protected getCartesianData(): SkyChartCartesianData<TSeries> | undefined {
    return resolveCartesianData(
      this.categoryAxis(),
      this.valueAxis(),
      this.series(),
    );
  }

  protected isSeriesHidden(chartSeries: TSeries): boolean {
    // The legend only renders with multiple series, so a lone series must
    // never stay hidden with no control left to show it again.
    return this.series().length > 1 && this.#hiddenSeries().has(chartSeries);
  }

  protected toggleSeries(index: number): void {
    const chartSeries = this.series()[index];

    this.#hiddenSeries.update((hiddenSeries) => {
      const next = new Set(hiddenSeries);

      if (!next.delete(chartSeries)) {
        next.add(chartSeries);
      }

      return next;
    });
  }

  protected onDataPointClick({
    datasetIndex,
    index,
  }: SkyChartJsDataPointIndex): void {
    // Data points render only once the chart has data, and gaps (null values)
    // never render a data point.
    const data = this.getCartesianData() as SkyChartCartesianData<TSeries>;
    const chartSeries = data.series[datasetIndex];

    this.dataPointClickSource.next({
      category: data.categoryAxis.categories()[index],
      categoryIndex: index,
      seriesIndex: datasetIndex,
      seriesLabelText: chartSeries.labelText(),
      value: chartSeries.values()[index] as number | readonly [number, number],
    });
  }

  protected override getChartTable(): SkyChartTable | undefined {
    const data = this.getCartesianData();

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
    const data = this.getCartesianData();

    if (!data) {
      return undefined;
    }

    return {
      resourceKey: this.accessibleSummaryResourceKey,
      args: [data.series.length, data.categoryAxis.categories().length],
    };
  }
}
