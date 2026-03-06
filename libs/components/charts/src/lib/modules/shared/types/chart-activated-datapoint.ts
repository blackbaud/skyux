/**
 * Data emitted when a chart's data point is activated.
 */
export interface SkyChartActivatedDatapoint {
  /** The index of the series that was selected. */
  seriesIndex: number;

  /** * The index of the data point within the series. */
  dataIndex: number;
}
