/**
 * Describes the data point a user clicked, or activated with Enter or Space.
 * `TValue` is the chart's series value type, such as `SkyChartBarSeriesValue`.
 * @preview
 */
export interface SkyChartDataPointClickArgs<TValue> {
  /**
   * The category the data point is plotted against.
   */
  category: string | number;

  /**
   * The index of the data point's category, in the order the categories are
   * declared.
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
   * Gaps (`null` values) cannot be clicked, so the value is never `null`.
   */
  value: NonNullable<TValue>;
}
