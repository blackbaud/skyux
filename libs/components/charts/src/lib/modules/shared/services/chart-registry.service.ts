import { Signal } from '@angular/core';

import { SkyCategory } from '../types/category';
import { SkyChartDataPoint } from '../types/chart-data-point';
import { SkyChartSeries } from '../types/chart-series';

/**
 * This defines the contract for a chart registry service, which is responsible for managing the series and data points in a chart.
 */
export interface SkyChartRegistry<TData extends SkyChartDataPoint> {
  readonly series: Signal<SkyChartSeries<TData>[]>;

  upsertSeries(series: SkyChartSeries<TData>): void;
  removeSeries(id: number): void;
  upsertPoint(seriesId: number, point: TData): void;
  removePoint(seriesId: number, category: SkyCategory): void;
}
