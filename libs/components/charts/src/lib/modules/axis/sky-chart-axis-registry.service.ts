import { InjectionToken, Signal } from '@angular/core';

import {
  SkyChartCategoryAxisConfig,
  SkyChartMeasureAxisConfig,
} from '../shared/types/axis-types';

/**
 * This injection token provides access to a chart-specific chart axis registry.
 */
export const SKY_CHART_AXIS_REGISTRY = new InjectionToken<SkyChartAxisRegistry>(
  'SKY_CHART_AXIS_REGISTRY',
);


/**
 * The interface for a chart axis registry service, which is responsible for managing the configuration of category and measure axes in a chart
 */
export interface SkyChartAxisRegistry {
  /** Signals that emit the current category axes configuration. */
  readonly categoryAxis: Signal<SkyChartCategoryAxisConfig | undefined>;

  /** Signals that emit the current measure axes configuration. */
  readonly measureAxis: Signal<SkyChartMeasureAxisConfig | undefined>;

  /**
   * Updates or inserts the category axis configuration.
   * @param axis
   */
  upsertCategoryAxis(axis: SkyChartCategoryAxisConfig): void;

  /**
   * Removes the category axis configuration.
   */
  removeCategoryAxis(): void;

  /**
   * Updates or inserts the measure axis configuration.
   * @param axis 
   */
  upsertMeasureAxis(axis: SkyChartMeasureAxisConfig): void;

  /**
   * Removes the measure axis configuration.
   */
  removeMeasureAxis(): void;
}
