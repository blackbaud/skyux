import {
  SkyBaseDatum,
  SkyCartesianChartConfig,
  SkyChartDataPoint,
} from '../shared/chart-types';

export type SkyLineDatum = SkyBaseDatum;

export interface SkyLineChartPoint extends SkyChartDataPoint {
  /** Numeric value */
  value: SkyLineDatum;
}

/** Configuration for the line chart component. */
export type SkyLineChartConfig = SkyCartesianChartConfig<SkyLineChartPoint>;
