import { InjectionToken, Signal } from '@angular/core';

import {
  SkyChartCategoryAxisConfig,
  SkyChartMeasureAxisConfig,
} from '../shared/types/axis-types';

/**
 * This injection token provides access to a chart-specific chart axis registry, which is responsible for managing the configuration of category and measure axes in a chart.
 */
export const SKY_CHART_AXIS_REGISTRY = new InjectionToken<SkyChartAxisRegistry>(
  'SKY_CHART_AXIS_REGISTRY',
);

/**
 * The `SkyChartAxisRegistry` interface defines the contract for a chart axis registry service.
 */
export interface SkyChartAxisRegistry {
  /** Signals that emit the current category axes configuration. */
  readonly categoryAxis: Signal<SkyChartCategoryAxisConfig | undefined>;

  /** Signals that emit the current measure axes configuration. */
  readonly measureAxis: Signal<SkyChartMeasureAxisConfig | undefined>;

  upsertCategoryAxis(axis: SkyChartCategoryAxisConfig): void;
  removeCategoryAxis(): void;

  upsertMeasureAxis(axis: SkyChartMeasureAxisConfig): void;
  removeMeasureAxis(): void;
}
