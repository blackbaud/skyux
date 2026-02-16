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
export interface SkyLineChartConfig
  extends SkyCartesianChartConfig<SkyLineChartPoint> {
  /**
   * Orientation of the chart.
   * @default 'vertical'
   */
  orientation?: 'horizontal' | 'vertical';
}
