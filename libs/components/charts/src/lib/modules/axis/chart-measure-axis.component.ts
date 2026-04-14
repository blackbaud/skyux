import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  computed,
  effect,
  inject,
  input,
  numberAttribute,
} from '@angular/core';
import { SkyLogService } from '@skyux/core';

import {
  SkyChartAxisLabelText,
  SkyChartMeasureAxisConfig,
} from '../shared/types/axis-types';

import { SKY_CHART_AXIS_REGISTRY } from './chart-axis-registry.service';

/**
 * Configures the Chart's measure axis.
 */
@Component({
  selector: 'sky-chart-measure-axis',
  template: '',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SkyChartMeasureAxisComponent implements OnDestroy {
  readonly #logger = inject(SkyLogService);
  readonly #registry = inject(SKY_CHART_AXIS_REGISTRY);

  /**
   * The label displayed alongside the measure axis.
   */
  public readonly labelText = input.required<SkyChartAxisLabelText>();

  /**
   * The scale type for the measure axis.
   * @default 'linear'
   */
  public readonly scaleType = input<'linear' | 'logarithmic'>('linear');

  /**
   * The lower bound for the measure axis. The chart will not go below this value.
   */
  public readonly min = input<number, unknown>(undefined, {
    transform: numberAttribute,
  });

  /**
   * The upper bound for the measure axis. The chart will not exceed this value.
   */
  public readonly max = input<number, unknown>(undefined, {
    transform: numberAttribute,
  });

  /**
   * The preferred lower bound for the measure axis. The chart may still go below this value if the data requires it.
   */
  public readonly preferredMin = input<number, unknown>(undefined, {
    transform: numberAttribute,
  });

  /**
   * The preferred upper bound for the measure axis. The chart may still exceed this value if the data requires it.
   */
  public readonly preferredMax = input<number, unknown>(undefined, {
    transform: numberAttribute,
  });

  /**
   * The axis object
   * @internal
   */
  public readonly axis = computed<SkyChartMeasureAxisConfig>(() => {
    return {
      labelText: this.labelText(),
      scaleType: this.scaleType(),
      min: this.min(),
      max: this.max(),
      preferredMin: this.preferredMin(),
      preferredMax: this.preferredMax(),
    };
  });

  constructor() {
    effect(() => {
      const axis = this.axis();
      const { min, max, preferredMin, preferredMax } = axis;

      if (min !== undefined && preferredMin !== undefined) {
        this.#logger.warn(
          'Both `min` and `preferredMin` are set on the measure axis. The `preferredMin` value will be ignored because `min` sets a hard lower bound.',
        );
      }

      if (max !== undefined && preferredMax !== undefined) {
        this.#logger.warn(
          'Both `max` and `preferredMax` are set on the measure axis. The `preferredMax` value will be ignored because `max` sets a hard upper bound.',
        );
      }

      this.#registry.upsertMeasureAxis(axis);
    });
  }

  public ngOnDestroy(): void {
    this.#registry.removeMeasureAxis();
  }
}
