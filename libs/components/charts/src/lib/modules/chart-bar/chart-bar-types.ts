import { InjectionToken } from '@angular/core';

import { SkyChartDataPoint } from '../shared/types/chart-data-point';

/**
 * The orientation of the bar chart
 */
export type SkyChartBarOrientation = 'vertical' | 'horizontal';

/**
 * A bar chart data point, which can be a single numeric value.
 */
export type SkyChartBarDatum = number;

/**
 * Injection token for providing the series ID to datapoint components.
 * @internal
 */
export const SKY_CHART_BAR_SERIES_ID = new InjectionToken<number>(
  'SKY_CHART_BAR_SERIES_ID',
);

/**
 * A single data point within a bar chart series.
 * @internal
 */
export interface SkyChartBarPoint extends SkyChartDataPoint {
  /** The bar value */
  value: SkyChartBarDatum;
}
