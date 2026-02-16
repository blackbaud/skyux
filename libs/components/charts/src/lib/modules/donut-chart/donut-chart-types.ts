import { SkyChartDataPoint, SkyRadialChartConfig } from '../shared/chart-types';

export type SkyDonutDatum = number;

export interface SkyDonutChartSlice extends SkyChartDataPoint {
  /** Numeric value */
  value: SkyDonutDatum;
}

/** Configuration for the donut chart component. */
export type SkyDonutChartConfig = SkyRadialChartConfig<SkyDonutChartSlice>;
