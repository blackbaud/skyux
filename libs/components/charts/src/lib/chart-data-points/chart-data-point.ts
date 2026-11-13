/**
 * A data point drawn on the chart's canvas, measured so a focusable stand-in
 * can be positioned over it.
 * @internal
 */
export interface SkyChartDataPoint {
  /**
   * The Chart.js dataset (series) index.
   */
  datasetIndex: number;
  /**
   * The Chart.js data (category) index.
   */
  index: number;
  key: string;
  category: string;
  seriesLabelText: string;
  accessibleName: string;
  left: number;
  top: number;
  width: number;
  height: number;
  /**
   * The point's position along the category axis, in pixels.
   */
  plotX: number;
  /**
   * The point's position along the value axis, in pixels.
   */
  plotY: number;
}
