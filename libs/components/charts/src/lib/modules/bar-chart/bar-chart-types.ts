import { SkyCartesianChartConfig } from '../shared/types/cartesian-chart-config';
import { SkyChartDataPoint } from '../shared/types/chart-data-point';

export type SkyBarDatum = number | [number, number] | null;

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
