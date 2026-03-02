import { ChangeDetectionStrategy, Component, input } from '@angular/core';

/**
 * Configures the Chart's value axis.
 */
@Component({
  selector: 'sky-chart-value-axis',
  template: '',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SkyChartValueAxisComponent {
  /**
   * The label displayed alongside the value axis.
   */
  public readonly labelText = input.required<string>();

  /**
   * The scale type for the value axis.
   * @default 'linear'
   */
  public readonly scaleType = input<'linear' | 'logarithmic'>('linear');

  /**
   * The suggested lower bound for the value axis.
   * The chart may still go below this value if the data requires it.
   */
  public readonly suggestedMin = input<number>();

  /**
   * The suggested upper bound for the value axis.
   * The chart may still exceed this value if the data requires it.
   */
  public readonly suggestedMax = input<number>();

  /**
   * A function that formats the tick values for display on the value axis.
   * If not provided, the default numeric formatting will be used
   */
  public readonly tickFormatter = input<(tickValue: number) => string>();
}
