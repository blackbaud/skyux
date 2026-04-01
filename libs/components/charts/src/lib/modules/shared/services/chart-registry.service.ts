import { Signal } from '@angular/core';

import { SkyChartDataPoint } from '../types/chart-data-point';
import { SkyChartSeries } from '../types/chart-series';

/**
 * The interface for a chart registry service, which is responsible for managing the series and data points in a chart.
 */
export interface SkyChartRegistry<TData extends SkyChartDataPoint> {
  readonly series: Signal<SkyChartSeries<TData>[]>;

  /**
   * Updates or inserts a series in the chart.
   * @param series The series to upsert.
   */
  upsertSeries(series: SkyChartSeries<TData>): void;

  /**
   * Removes a series from the chart by its Series Id
   * @param seriesId The ID of the series to remove.
   */
  removeSeries(seriesId: number): void;

  /**
   * Updates or inserts a data point in a series.
   * @param seriesId The ID of the series to which the data point belongs.
   * @param point The data point to upsert.
   */
  upsertPoint(seriesId: number, point: TData): void;

  /**
   * Removes a data point from a series by its point ID.
   * @param seriesId The ID of the series from which to remove the data point.
   * @param pointId The unique identifier of the data point to remove.
   */
  removePoint(seriesId: number, pointId: number): void;
}
