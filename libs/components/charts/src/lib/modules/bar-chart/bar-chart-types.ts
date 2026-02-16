import {
  SkyBaseDatum,
  SkyCartesianChartConfig,
  SkyChartDataPoint,
} from '../shared/chart-types';

export type SkyBarDatum = SkyBaseDatum | [number, number];

export interface SkyBarChartPoint extends SkyChartDataPoint {
  /** Numeric value or floating range */
  value: SkyBarDatum;
}

/** Configuration for the bar chart component. */
export interface SkyBarChartConfig
  extends SkyCartesianChartConfig<SkyBarChartPoint> {
  /**
   * Orientation of the chart.
   * @default 'vertical'
   */
  orientation?: 'horizontal' | 'vertical';
}
