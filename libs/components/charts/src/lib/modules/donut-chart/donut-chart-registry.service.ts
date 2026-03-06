import { Injectable, signal } from '@angular/core';

import { SkyChartRegistry } from '../shared/services/chart-registry.service';
import { SkyCategory } from '../shared/types/category';
import { SkyChartSeries } from '../shared/types/chart-series';

import { SkyDonutChartSlice } from './donut-chart-types';

@Injectable()
export class SkyDonutChartRegistry
  implements SkyChartRegistry<SkyDonutChartSlice>
{
  public readonly series = signal<SkyChartSeries<SkyDonutChartSlice>[]>([]);

  public upsertSeries(series: SkyChartSeries<SkyDonutChartSlice>): void {
    this.series.update((list) => {
      const idx = list.findIndex((s) => s.id === series.id);

      // Already exists, update it
      if (idx >= 0) {
        return list.map((s) => (s.id === series.id ? series : s));
      }

      // New series, add it
      return [...list, series];
    });
  }

  public removeSeries(seriesId: number): void {
    this.series.update((list) => list.filter((s) => s.id !== seriesId));
  }

  public upsertPoint(seriesId: number, point: SkyDonutChartSlice): void {
    this.series.update((list) =>
      list.map((s) => {
        // Not the series we're looking for
        if (s.id !== seriesId) {
          return s;
        }

        // Remove any existing point in the series with the same category
        const dataToKeep = s.data.filter((p) => p.category !== point.category);
        const newData = [...dataToKeep, point];
        return { ...s, data: newData };
      }),
    );
  }

  public removePoint(seriesId: number, category: SkyCategory): void {
    this.series.update((list) =>
      list.map((s) => {
        if (s.id !== seriesId) {
          return s;
        }

        const newData = s.data.filter((p) => p.category !== category);
        return { ...s, data: newData };
      }),
    );
  }
}
