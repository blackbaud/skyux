import { InjectionToken } from '@angular/core';

import { SkyChartDataPoint } from '../shared/types/chart-data-point';

/**
 * A line chart data point, which is a single numeric value representing the position of the point on the y-axis.
 */
export type SkyChartLineDatum = number;

/**
 * Injection token for providing the series ID to datapoint components.
 * @internal
 */
export const SKY_CHART_LINE_SERIES_ID = new InjectionToken<number>(
  'SKY_CHART_LINE_SERIES_ID',
);

/**
 * A single data point within a line chart series.
 * @internal
 */
export interface SkyChartLinePoint extends SkyChartDataPoint {
  /** Numeric value */
  value: SkyChartLineDatum;
}
