import {
  ChangeDetectionStrategy,
  Component,
  computed,
  contentChildren,
  inject,
  input,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { SkyAppLocaleProvider } from '@skyux/i18n';
import { SkyThemeService } from '@skyux/theme';
import { type ChartDataset, type TooltipItem } from 'chart.js';
import { EMPTY, map } from 'rxjs';

import { optionalNumberAttribute } from '../chart-axis/optional-number-attribute';
import { SkyChartJs, type SkyChartJsConfig } from '../chart-js/chart-js';
import { extendBaseChartJsConfig } from '../chart-js/chart-js-config-utils';
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
 *
 * @preview
 */
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SkyChartJs],
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

  protected readonly slices = contentChildren(SkyChartPieSlice);

  protected readonly chartJsConfig = computed(() => this.#getChartJsConfig());

  /**
   * The height to apply to the rendered chart. Chart.js runs with
   * `maintainAspectRatio: false`, so its container must be given an explicit
   * height; pie charts always use the themed default.
   */
  protected readonly chartHeight = computed(() => {
    // Read the theme signal so the height recomputes when the theme changes.
    this.#themeSettings();

    return this.getThemeStyles().height.default;
  });

  readonly #formatValue = computed<(value: number) => string>(() =>
    createSkyChartValueFormatter({
      format: this.valueFormat(),
      currencyCode: this.currencyCode(),
      digits: this.digits(),
      locale: this.#locale(),
    }),
  );

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
    | SkyChartAccessibleSummary
    | undefined {
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

    // Read the theme signal so the config rebuilds when the theme changes,
    // then resolve the themed CSS custom properties to concrete values.
    this.#themeSettings();

    const themeStyles = this.getThemeStyles();
    const categorical = themeStyles.series.categoricalPalette;
    const formatValue = this.#formatValue();

    const dataset: ChartDataset<'pie'> = {
      label: this.valueLabelText(),
      data: slices.map((slice) => slice.value()),
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
