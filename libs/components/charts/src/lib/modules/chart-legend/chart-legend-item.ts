/**
 * A legend item in the chart legend.
 */
export interface SkyChartLegendItem {
  /** The dataset index */
  datasetIndex: number;
  /** The legend item index */
  index: number;
  /** Is the dataset visible in the chart */
  isVisible: boolean;
  /** The legend item's label */
  labelText: string;
  /** The series color */
  seriesColor: string;
}
