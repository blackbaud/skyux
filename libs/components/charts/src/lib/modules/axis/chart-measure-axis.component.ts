import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from '@angular/core';

import { SkyChartMeasureAxisConfig } from '../shared/types/axis-types';

/**
 * Configures the Chart's measure axis.
 */
@Component({
  selector: 'sky-chart-measure-axis',
  template: '',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SkyChartMeasureAxisComponent {
  /**
   * The label displayed alongside the measure axis.
   */
  public readonly labelText = input.required<string>();

  /**
   * The scale type for the measure axis.
   * @default 'linear'
   */
  public readonly scaleType = input<'linear' | 'logarithmic'>('linear');

  /**
   * The suggested lower bound for the measure axis.
   * The chart may still go below this value if the data requires it.
   */
  public readonly suggestedMin = input<number>();

  /**
   * The suggested upper bound for the measure axis.
   * The chart may still exceed this value if the data requires it.
   */
  public readonly suggestedMax = input<number>();

  /**
   * A function that formats the tick values for display on the measure axis.
   * If not provided, the default numeric formatting will be used
   */
  public readonly tickFormatter =
    input<(tickValue: number | string) => string>();

  /**
   * The axis object
   * @internal
   */
  public readonly axis = computed<SkyChartMeasureAxisConfig>(() => {
    return {
      label: this.labelText(),
      scaleType: this.scaleType(),
      suggestedMin: this.suggestedMin(),
      suggestedMax: this.suggestedMax(),
      tickFormatter: this.tickFormatter(),
    };
  });
}
