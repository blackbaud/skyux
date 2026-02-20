import { SkyCategory } from './category';

/**
 * Defines the structure of a data point in a chart.
 */
export interface SkyChartDataPoint {
  /** The label for the datapoint */
  label: string;

  /** The category */
  category: SkyCategory;
}
