import { SkyCartesianChartConfig } from '../shared/types/cartesian-chart-config';
import { SkyChartDataPoint } from '../shared/types/chart-data-point';

export type SkyLineDatum = number | null;

export interface SkyLineChartPoint extends SkyChartDataPoint {
  /** Numeric value */
  value: SkyLineDatum;
}

/** Configuration for the line chart component. */
export type SkyLineChartConfig = SkyCartesianChartConfig<SkyLineChartPoint>;
