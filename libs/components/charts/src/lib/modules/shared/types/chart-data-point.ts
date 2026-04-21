import { SkyCategory } from './category';

/**
 * Defines the structure of a data point in a chart.
 */
export interface SkyChartDataPoint {
  /** The internal unique identifier for the data point component instance. */
  id: number;

  /** The label for the datapoint */
  labelText: string;

  /** The category */
  category: SkyCategory;
}
