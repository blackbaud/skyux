/**
 * Describes the data point a user clicked, or activated with Enter or Space.
 */
export interface SkyChartDataPointClick {
  /**
   * The category the data point is plotted against.
   */
  category: string | number;

  /**
   * The index of the data point's category on the category axis.
   */
  categoryIndex: number;

  /**
   * The index of the data point's series, in the order the series are
   * declared.
   */
  seriesIndex: number;

  /**
   * The label of the data point's series.
   */
  seriesLabelText: string;

  /**
   * The data point's value. A floating bar's value is a `[start, end]` tuple.
   */
  value: number | readonly [number, number];
}
