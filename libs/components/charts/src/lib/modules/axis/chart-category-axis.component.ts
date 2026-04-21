import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  computed,
  effect,
  inject,
  input,
} from '@angular/core';

import {
  SkyChartAxisLabelText,
  SkyChartCategoryAxisConfig,
} from '../shared/types/axis-types';

import { SKY_CHART_AXIS_REGISTRY } from './chart-axis-registry.service';

/**
 * Configures the chart's category axis
 */
@Component({
  selector: 'sky-chart-category-axis',
  template: '',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SkyChartCategoryAxisComponent implements OnDestroy {
  readonly #registry = inject(SKY_CHART_AXIS_REGISTRY);

  /**
   * The label displayed alongside the category axis.
   */
  public readonly labelText = input.required<SkyChartAxisLabelText>();

  /**
   * The axis object
   */
  readonly #axis = computed<SkyChartCategoryAxisConfig>(() => {
    return {
      labelText: this.labelText(),
    };
  });

  constructor() {
    effect(() => {
      const axis = this.#axis();
      this.#registry.upsertCategoryAxis(axis);
    });
  }

  public ngOnDestroy(): void {
    this.#registry.removeCategoryAxis();
  }
}
