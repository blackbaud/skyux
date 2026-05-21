import { InjectionToken } from '@angular/core';

import { SkyChartDataPoint } from '../shared/types/chart-data-point';

/**
 * A donut chart data point, which is a single numeric value representing the size of the slice.
 */
export type SkyChartDonutDatum = number;

/**
 * Injection token for providing the series ID to datapoint components.
 * @internal
 */
export const SKY_CHART_DONUT_SERIES_ID = new InjectionToken<number>(
  'SKY_CHART_DONUT_SERIES_ID',
);

/**
 * A single data point within a donut chart series.
 * @internal
 */
export interface SkyChartDonutSlice extends SkyChartDataPoint {
  /** Numeric value */
  value: SkyChartDonutDatum;
}
