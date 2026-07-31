import {
  afterRenderEffect,
  contentChild,
  Directive,
  inject,
  Signal,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { SkyLogService } from '@skyux/core';
import { SkyThemeService } from '@skyux/theme';
import { EMPTY, map } from 'rxjs';

import { SkyChartAxisCategory } from '../chart-axis/chart-axis-category';
import { SkyChartAxisValue } from '../chart-axis/chart-axis-value';
import {
  buildCartesianTable,
  resolveCartesianData,
  type SkyChartCartesianData,
  type SkyChartCartesianSeries,
} from '../chart-js/cartesian-utils';
import { SkyChartTable } from '../chart-table/chart-table';
import { SkyChartAccessibleSummary } from '../chart-table/chart-table-service';
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
  /**
   * The active theme's settings. Read this in computed values that resolve
   * themed styles so they recompute when the theme changes.
   */
  protected readonly themeSettings = toSignal(
    inject(SkyThemeService, { optional: true })?.settingsChange.pipe(
      map((change) => change.currentSettings),
    ) ?? EMPTY,
    { initialValue: undefined },
  );

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
