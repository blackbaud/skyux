import { Injectable, signal } from '@angular/core';

import { SkyChartRegistry } from '../shared/services/chart-registry.service';
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
        if (s.id !== seriesId) {
          return s;
        }

        const dataToKeep = s.data.filter((p) => p.id !== point.id);
        const newData = [...dataToKeep, point];
        return { ...s, data: newData };
      }),
    );
  }

  public removePoint(seriesId: number, pointId: number): void {
    this.series.update((list) =>
      list.map((s) => {
        if (s.id !== seriesId) {
          return s;
        }

        const newData = s.data.filter((p) => p.id !== pointId);
        return { ...s, data: newData };
      }),
    );
  }
}
