import { Injectable, signal } from '@angular/core';

import { SkyChartTable } from './chart-table';

/**
 * A localized, descriptive summary of a chart's plotted content, used as the
 * accessible name of the chart figure. Each plot type supplies its own resource
 * key and arguments so the wording can describe that type's shape (for example,
 * a bar chart's series and categories).
 * @internal
 */
export interface SkyChartAccessibleSummary {
  /**
   * The resource key of the localized summary sentence.
   */
  resourceKey: string;

  /**
   * The positional arguments for the localized summary sentence.
   */
  args: (string | number)[];
}

/**
 * Bridges a chart's tabular representation from the plotted chart component to
 * the data table modal. Provided at the `sky-chart` level so each chart has its
 * own instance.
 * @internal
 */
@Injectable()
export class SkyChartTableService {
  /**
   * The current tabular representation of the chart, or `undefined` when the
   * chart has no data to represent.
   */
  public readonly table = signal<SkyChartTable | undefined>(undefined);

  /**
   * The current accessible summary of the chart, or `undefined` when the chart
   * has no data to represent.
   */
  public readonly summary = signal<SkyChartAccessibleSummary | undefined>(
    undefined,
  );
}
