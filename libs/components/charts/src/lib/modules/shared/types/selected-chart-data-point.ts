/**
 * Data emitted when a chart's data point is selected.
 */
export interface SkySelectedChartDataPoint {
  /** The index of the series that was selected. */
  seriesIndex: number;

  /** * The index of the data point within the series. */
  dataIndex: number;
}
