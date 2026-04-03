import { Injectable, signal } from '@angular/core';

import { SkyChartAxisRegistry } from '../axis/sky-chart-axis-registry.service';
import { SkyChartRegistry } from '../shared/services/chart-registry.service';
import {
  SkyChartCategoryAxisConfig,
  SkyChartMeasureAxisConfig,
} from '../shared/types/axis-types';
import { SkyChartSeries } from '../shared/types/chart-series';

import { SkyBarChartPoint } from './bar-chart-types';

@Injectable()
export class SkyBarChartRegistry
  implements SkyChartRegistry<SkyBarChartPoint>, SkyChartAxisRegistry
{
  public readonly categoryAxis = signal<SkyChartCategoryAxisConfig | undefined>(
    undefined,
  );
  public readonly measureAxis = signal<SkyChartMeasureAxisConfig | undefined>(
    undefined,
  );
  public readonly series = signal<SkyChartSeries<SkyBarChartPoint>[]>([]);

  public upsertCategoryAxis(axis: SkyChartCategoryAxisConfig): void {
    this.categoryAxis.set(axis);
  }

  public removeCategoryAxis(): void {
    this.categoryAxis.set(undefined);
  }

  public upsertMeasureAxis(axis: SkyChartMeasureAxisConfig): void {
    this.measureAxis.set(axis);
  }

  public removeMeasureAxis(): void {
    this.measureAxis.set(undefined);
  }

  public upsertSeries(series: SkyChartSeries<SkyBarChartPoint>): void {
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

  public upsertPoint(seriesId: number, point: SkyBarChartPoint): void {
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
