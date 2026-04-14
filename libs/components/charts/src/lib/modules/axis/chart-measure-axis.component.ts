import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  booleanAttribute,
  computed,
  effect,
  inject,
  input,
  numberAttribute,
} from '@angular/core';

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
   * When true, `min` acts as a soft lower bound: the axis starts at `min` but may extend below it if the data requires it.
   * When false or omitted, `min` is a hard lower bound and the axis will never go below it.
   */
  public readonly allowMinOverflow = input(false, {
    transform: booleanAttribute,
  });

  /**
   * When true, `max` acts as a soft upper bound: the axis starts at `max` but may extend above it if the data requires it.
   * When false or omitted, `max` is a hard upper bound and the axis will never exceed it.
   */
  public readonly allowMaxOverflow = input(false, {
    transform: booleanAttribute,
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
      allowMinOverflow: this.allowMinOverflow(),
      allowMaxOverflow: this.allowMaxOverflow(),
    };
  });

  constructor() {
    effect(() => {
      this.#registry.upsertMeasureAxis(this.axis());
    });
  }

  public ngOnDestroy(): void {
    this.#registry.removeMeasureAxis();
  }
}
