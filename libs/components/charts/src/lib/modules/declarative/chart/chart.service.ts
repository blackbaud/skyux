import { Injectable, signal } from '@angular/core';

import { SkyChartLegendItem } from '../../chart-legend/chart-legend-item';
import { SkyChartDataPoint } from '../../shared/types/chart-data-point';
import { SkyChartSeries } from '../../shared/types/chart-series';

/**
 * Service for sharing state between the chart component and nested chart type components.
 */
@Injectable()
export class SkyChartService {
  public readonly series = signal<SkyChartSeries<SkyChartDataPoint>[]>([]);
  public readonly legendItems = signal<SkyChartLegendItem[]>([]);
  public readonly legendItemToggleRequested = signal<
    SkyChartLegendItem | undefined
  >(undefined);

  public setSeries(series: SkyChartSeries<SkyChartDataPoint>[]): void {
    this.series.set(series);
  }

  public setLegendItems(legendItems: SkyChartLegendItem[]): void {
    this.legendItems.set(legendItems);
  }

  public toggleLegendItem(item: SkyChartLegendItem): void {
    this.legendItemToggleRequested.set(item);
  }
}
