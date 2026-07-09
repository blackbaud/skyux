import {
  afterRenderEffect,
  ChangeDetectionStrategy,
  Component,
  computed,
  contentChild,
  contentChildren,
  DestroyRef,
  ElementRef,
  inject,
  input,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { SkyLogService } from '@skyux/core';
import { SkyThemeService } from '@skyux/theme';
import { type ChartConfiguration, type ChartDataset } from 'chart.js/auto';
import { EMPTY, map } from 'rxjs';

import { SkyChartAxisCategory } from '../axis/chart-axis-category';
import { SkyChartAxisValue } from '../axis/chart-axis-value';
import { SkyChartJs } from '../chart-js/chart-js';
import { SkyChartSeries } from '../chart-series/chart-series';
import { SkyChartTable } from '../chart-table/chart-table';
import { SkyChartTableService } from '../chart-table/chart-table-service';
import {
  buildCartesianScales,
  buildCartesianTable,
  buildValueTooltipLabel,
  getValueAxisScaleKeys,
  hasCartesianData,
  resolveSeriesBindings,
  SKY_CATEGORY_AXIS_ID,
} from '../shared/cartesian-utils';
import {
  readThemeCategoricalPalette,
  readThemeCssNumber,
  readThemeCssString,
} from '../shared/theme-css-utils';
import { SkyChartBarOrientation } from './chart-bar-orientation';

type BarChartConfig = ChartConfiguration<'bar'> & {
  options: NonNullable<ChartConfiguration<'bar'>['options']>;
};

/**
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
export class SkyChartBar {
  readonly #elementRef = inject(ElementRef);
  readonly #logSvc = inject(SkyLogService);
  readonly #tableSvc = inject(SkyChartTableService, { optional: true });

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

  protected readonly categoryAxis = contentChild(SkyChartAxisCategory);
  protected readonly valueAxes = contentChildren(SkyChartAxisValue);
  protected readonly series = contentChildren(SkyChartSeries);

  protected readonly config = computed(() => this.#buildConfig());

  constructor() {
    inject(DestroyRef).onDestroy(() => {
      this.#tableSvc?.table.set(undefined);
    });

    afterRenderEffect(() => {
      this.#tableSvc?.table.set(this.#buildTable());
    });
  }

  #buildTable(): SkyChartTable | undefined {
    const categoryAxis = this.categoryAxis();
    const valueAxes = this.valueAxes();
    const series = this.series();

    if (!hasCartesianData(categoryAxis, valueAxes, series)) {
      return undefined;
    }

    return buildCartesianTable(categoryAxis, valueAxes, series);
  }

  #buildConfig(): BarChartConfig | undefined {
    const categoryAxis = this.categoryAxis();
    const valueAxes = this.valueAxes();
    const series = this.series();

    if (!hasCartesianData(categoryAxis, valueAxes, series)) {
      return undefined;
    }

    // Read the theme signal so the config rebuilds when the theme changes,
    // then resolve the themed CSS custom properties to concrete values.
    this.#themeSettings();

    const styles = getComputedStyle(this.#elementRef.nativeElement);

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

    // Series cycle through the categorical palette so each is distinct.
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
        dataset.yAxisID = SKY_CATEGORY_AXIS_ID;
      } else {
        dataset.yAxisID = valueKey;
        dataset.xAxisID = SKY_CATEGORY_AXIS_ID;
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
    };
  }
}
