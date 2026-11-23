import {
  afterRenderEffect,
  computed,
  contentChild,
  Directive,
  inject,
  Signal,
  signal,
} from '@angular/core';
import { outputFromObservable, toSignal } from '@angular/core/rxjs-interop';
import { SkyLogService } from '@skyux/core';
import { SkyAppLocaleProvider, SkyLibResourcesService } from '@skyux/i18n';
import { SkyThemeService } from '@skyux/theme';
import { EMPTY, map, Subject } from 'rxjs';

import { SkyChartAxisCategory } from '../chart-axis/chart-axis-category';
import { getTimeScaleError } from '../chart-axis/chart-axis-category-utils';
import { SkyChartAxisValue } from '../chart-axis/chart-axis-value';
import { type SkyChartJsDataPointIndex } from '../chart-js-plugins/chart-js-data-point-index';
import {
  buildCartesianTable,
  resolveCartesianData,
  type SkyChartCartesianData,
  type SkyChartCartesianSeries,
} from '../chart-js/cartesian-utils';
import { type SkyChartDateAdapterOptions } from '../chart-js/chart-js-date-adapter';
import { type SkyChartLegendItem } from '../chart-legend/chart-legend';
import { SkyChartTable } from '../chart-table/chart-table';
import { SkyChartAccessibleSummary } from '../chart-table/chart-table-service';
import { type SkyChartDataPointClickArgs } from './chart-data-point-click-args';
import { SkyChartPlot } from './chart-plot';

/**
 * Base class for cartesian plot components (for example, `sky-chart-bar` and
 * `sky-chart-line`): plots that render one or more series against a category
 * axis and a value axis. Owns the axis content queries, the theme change
 * signal, the accessible table and summary, the series/category
 * length-mismatch warning, and the category axis error. Subclasses supply the series content query, the
 * series selector, the summary resource key, and their own Chart.js config.
 * @internal
 */
@Directive()
export abstract class SkyChartCartesianPlot<
  TSeries extends SkyChartCartesianSeries,
  TValue,
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

  readonly #localeProvider = inject(SkyAppLocaleProvider);

  readonly #locale = toSignal(
    this.#localeProvider.getLocaleInfo().pipe(map((info) => info.locale)),
    { initialValue: this.#localeProvider.defaultLocale },
  );

  readonly #resourcesSvc = inject(SkyLibResourcesService);

  /**
   * How a time scale formats dates for the current locale.
   */
  protected readonly dateAdapterOptions = computed(
    (): SkyChartDateAdapterOptions => {
      const locale = this.#locale();

      return {
        locale,
        quarterLabel: this.#resourcesSvc.getStringForLocale(
          { locale },
          'skyux_charts.time_scale.quarter_label',
        ),
      };
    },
  );
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

  protected readonly dataPointClickSource = new Subject<
    SkyChartDataPointClickArgs<TValue>
  >();

  /**
   * Fires when the user clicks a data point, or presses Enter or Space while a
   * data point has focus.
   */
  public readonly dataPointClick = outputFromObservable(
    this.dataPointClickSource,
  );

  readonly #hiddenSeries = signal<ReadonlySet<TSeries>>(new Set());

  readonly #categoryAxisError = computed(() => {
    const categoryAxis = this.categoryAxis();

    return categoryAxis && this.getCategoryAxisError(categoryAxis);
  });

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

    afterRenderEffect(() => {
      const error = this.#categoryAxisError();

      if (error) {
        logger.error(error);
      }
    });

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
   * Explains why the category axis can't be plotted, if it can't.
   */
  protected getCategoryAxisError(
    categoryAxis: SkyChartAxisCategory,
  ): string | undefined {
    return getTimeScaleError(categoryAxis);
  }

  /**
   * Resolves the axes and series into the data the plot needs to render, or
   * `undefined` when a required axis or series is missing or the category axis
   * can't be plotted.
   */
  protected getCartesianData(): SkyChartCartesianData<TSeries> | undefined {
    if (this.#categoryAxisError()) {
      return undefined;
    }

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
      value: chartSeries.values()[index] as NonNullable<TValue>,
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
      this.dateAdapterOptions(),
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
