import { Injectable, signal } from '@angular/core';

import { SkyChartAxisRegistry } from '../axis/sky-chart-registry.service';
import { SkyChartRegistry } from '../shared/services/chart-registry.service';
import {
  SkyChartCategoryAxisConfig,
  SkyChartMeasureAxisConfig,
} from '../shared/types/axis-types';
import { SkyCategory } from '../shared/types/category';
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

  public removeSeries(id: number): void {
    this.series.update((list) => list.filter((s) => s.id !== id));
  }

  public upsertPoint(seriesId: number, point: SkyBarChartPoint): void {
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
