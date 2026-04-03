import type { SkyCategory } from './category';

/**
 * Data emitted when a chart's data point is activated.
 */
export interface SkyChartClickedDataPoint<TData> {
  /** The series the activated data point belongs to. */
  series: string;

  /** The category */
  category: SkyCategory;

  /** The value of the data point */
  value: TData;
}
