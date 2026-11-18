import {
  Component,
  computed,
  contentChildren,
  inject,
  input,
  signal,
} from '@angular/core';
import { outputFromObservable, toSignal } from '@angular/core/rxjs-interop';
import { SkyAppLocaleProvider } from '@skyux/i18n';
import { SkyThemeService } from '@skyux/theme';
import { type ChartDataset, type TooltipItem } from 'chart.js';
import { EMPTY, map, Subject } from 'rxjs';

import { optionalNumberAttribute } from '../chart-axis/optional-number-attribute';
import { type SkyChartJsDataPointIndex } from '../chart-js-plugins/chart-js-data-point-index';
import { SkyChartJs, type SkyChartJsConfig } from '../chart-js/chart-js';
import { extendBaseChartJsConfig } from '../chart-js/chart-js-config-utils';
import {
  SkyChartLegend,
  type SkyChartLegendItem,
} from '../chart-legend/chart-legend';
import { type SkyChartDataPointClickArgs } from '../chart-plot/chart-data-point-click-args';
import { SkyChartPlot } from '../chart-plot/chart-plot';
import { SkyChartTable } from '../chart-table/chart-table';
import { SkyChartAccessibleSummary } from '../chart-table/chart-table-service';
import { SkyChartValueFormat } from '../shared/value-format';
import { createSkyChartValueFormatter } from '../shared/value-formatter';
import { SkyChartPieDisplayMode } from './chart-pie-display-mode';
import { SkyChartPieSlice } from './chart-pie-slice';

/**
 * The fraction of the chart radius cut out of the center in the `donut`
 * display mode.
 */
const DONUT_CUTOUT = '65%';

/**
 * Renders a pie chart from one or more slices. The `donut` display mode
 * renders the same chart as a ring with a hollow center.
 * @preview
 */
@Component({
  imports: [SkyChartJs, SkyChartLegend],
  selector: 'sky-chart-pie',
  templateUrl: './chart-pie.html',
})
export class SkyChartPie extends SkyChartPlot {
  readonly #localeProvider = inject(SkyAppLocaleProvider);

  readonly #locale = toSignal(
    this.#localeProvider.getLocaleInfo().pipe(map((info) => info.locale)),
    { initialValue: this.#localeProvider.defaultLocale },
  );

  readonly #themeSettings = toSignal(
    inject(SkyThemeService, { optional: true })?.settingsChange.pipe(
      map((change) => change.currentSettings),
    ) ?? EMPTY,
    { initialValue: undefined },
  );

  /**
   * The label that describes what the slices represent, shown as the
   * category header of the chart's data table.
   */
  public readonly categoryLabelText = input.required<string>();

  /**
   * The ISO 4217 currency code used when `valueFormat` is `currency`. When
   * unset, currency values format as `USD`.
   */
  public readonly currencyCode = input<string>();

  /**
   * The number of decimal places to display. When unset, the format's
   * locale-aware default is used (for example, two places for most
   * currencies).
   */
  public readonly digits = input(undefined, {
    transform: optionalNumberAttribute,
  });

  /**
   * How the chart renders its slices: a solid `pie` or a `donut` ring with a
   * hollow center.
   * @default 'pie'
   */
  public readonly displayMode = input<SkyChartPieDisplayMode>('pie');

  /**
   * How to format the slice values in tooltips and the data table. The
   * `percent` format expects fractional values, so `0.25` displays as `25%`.
   * @default 'number'
   */
  public readonly valueFormat = input<SkyChartValueFormat>('number');

  /**
   * The label that describes the plotted values, shown as the value column
   * header of the chart's data table.
   */
  public readonly valueLabelText = input.required<string>();

  protected readonly dataPointClickSource = new Subject<
    SkyChartDataPointClickArgs<number>
  >();

  /**
   * Fires when the user clicks a slice, or presses Enter or Space while a
   * slice has focus.
   */
  public readonly dataPointClick = outputFromObservable(
    this.dataPointClickSource,
  );

  protected readonly slices = contentChildren(SkyChartPieSlice);

  /**
   * The active theme's resolved chart styling. Resolving forces a style
   * recalculation, so it is computed once per theme change and shared.
   */
  protected readonly themeStyles = computed(() => {
    this.#themeSettings();

    return this.getThemeStyles();
  });

  protected readonly chartJsConfig = computed(() => this.#getChartJsConfig());

  /**
   * The height to apply to the rendered chart. Chart.js runs with
   * `maintainAspectRatio: false`, so its container must be given an explicit
   * height; pie charts always use the themed default.
   */
  protected readonly chartHeight = computed(
    () => this.themeStyles().height.default,
  );

  readonly #hiddenSlices = signal<ReadonlySet<SkyChartPieSlice>>(new Set());

  // A pie's legend identifies its slices, so it renders even for one slice.
  protected readonly legendItems = computed((): SkyChartLegendItem[] => {
    const palette = this.themeStyles().series.categoricalPalette;
    const hiddenSlices = this.#hiddenSlices();

    return this.slices().map((slice, index) => ({
      labelText: slice.labelText(),
      color: palette[index % palette.length],
      hidden: hiddenSlices.has(slice),
    }));
  });

  readonly #formatValue = computed<(value: number) => string>(() =>
    createSkyChartValueFormatter({
      format: this.valueFormat(),
      currencyCode: this.currencyCode(),
      digits: this.digits(),
      locale: this.#locale(),
    }),
  );

  protected toggleSlice(index: number): void {
    const slice = this.slices()[index];

    this.#hiddenSlices.update((hiddenSlices) => {
      const next = new Set(hiddenSlices);

      if (!next.delete(slice)) {
        next.add(slice);
      }

      return next;
    });
  }

  protected onDataPointClick({ index }: SkyChartJsDataPointIndex): void {
    const slice = this.slices()[index];

    this.dataPointClickSource.next({
      category: slice.labelText(),
      categoryIndex: index,
      seriesIndex: 0,
      seriesLabelText: this.valueLabelText(),
      value: slice.value(),
    });
  }

  protected override getChartTable(): SkyChartTable | undefined {
    const slices = this.slices();

    if (slices.length === 0) {
      return undefined;
    }

    const formatValue = this.#formatValue();

    return {
      categoryLabel: this.categoryLabelText(),
      categories: slices.map((slice) => slice.labelText()),
      series: [
        {
          label: this.valueLabelText(),
          values: slices.map((slice) => formatValue(slice.value())),
        },
      ],
    };
  }

  protected override getAccessibleSummary():
    SkyChartAccessibleSummary | undefined {
    const slices = this.slices();

    if (slices.length === 0) {
      return undefined;
    }

    return {
      resourceKey:
        this.displayMode() === 'donut'
          ? 'skyux_charts.chart.donut.accessible_summary'
          : 'skyux_charts.chart.pie.accessible_summary',
      args: [slices.length],
    };
  }

  #getChartJsConfig(): SkyChartJsConfig<'pie'> | undefined {
    const slices = this.slices();

    if (slices.length === 0) {
      return undefined;
    }

    const themeStyles = this.themeStyles();
    const categorical = themeStyles.series.categoricalPalette;
    const formatValue = this.#formatValue();
    const hiddenSlices = this.#hiddenSlices();

    const dataset: ChartDataset<'pie'> = {
      label: this.valueLabelText(),
      // A hidden slice keeps its index, so the remaining slices keep their
      // colors. Chart.js draws a null slice with no size, and null values are
      // excluded from keyboard navigation like gaps in a line.
      data: slices.map((slice) =>
        hiddenSlices.has(slice) ? null : slice.value(),
      ) as number[],
      // Unlike a cartesian series, every slice gets its own categorical
      // color, cycling through the palette when there are more slices than
      // colors.
      backgroundColor: slices.map(
        (_, index) => categorical[index % categorical.length],
      ),
    };

    return extendBaseChartJsConfig<'pie'>(themeStyles, {
      type: 'pie',
      data: {
        labels: slices.map((slice) => slice.labelText()),
        datasets: [dataset],
      },
      options: {
        // A donut is a pie with its center cut out; the display mode only
        // controls the cutout.
        cutout: this.displayMode() === 'donut' ? DONUT_CUTOUT : 0,
        elements: {
          arc: {
            borderWidth: 1,
            borderColor: themeStyles.arc.borderColor,
          },
        },
        plugins: {
          tooltip: {
            // The base config indexes tooltips along a cartesian axis; a pie
            // has no axes, so tooltips target the hovered slice precisely.
            mode: 'nearest',
            intersect: true,
            callbacks: {
              label: (context: TooltipItem<'pie'>): string =>
                `${context.label}: ${formatValue(context.parsed)}`,
            },
          },
        },
      },
    });
  }
}
