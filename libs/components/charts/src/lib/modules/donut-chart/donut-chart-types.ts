import { SkyChartDataPoint } from '../shared/types/chart-data-point';
import { SkyRadialChartConfig } from '../shared/types/radial-chart-config';

export type SkyDonutDatum = number;

export interface SkyDonutChartSlice extends SkyChartDataPoint {
  /** Numeric value */
  value: SkyDonutDatum;
}

/** Configuration for the donut chart component. */
export type SkyDonutChartConfig = SkyRadialChartConfig<SkyDonutChartSlice>;
