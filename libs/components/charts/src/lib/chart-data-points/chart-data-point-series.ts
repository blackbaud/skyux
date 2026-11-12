import { type SkyChartDataPoint } from './chart-data-point';

/**
 * The data points of a single series, described to assistive technology as a
 * group when the chart has multiple series.
 * @internal
 */
export interface SkyChartDataPointSeries {
  datasetIndex: number;
  dataPoints: SkyChartDataPoint[];
  labelText: string;
  seriesCount: number;
  valueCount: number;
}
