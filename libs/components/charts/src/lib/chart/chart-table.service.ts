import { Injectable, signal } from '@angular/core';

import { SkyChartTable } from './chart-table';

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
}
