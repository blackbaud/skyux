import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from '@angular/core';

import { SkyCategory } from '../shared/types/category';

import { SkyBarChartPoint, SkyBarDatum } from './bar-chart-types';

/**
 * Represents a single data point within a chart series.
 */
@Component({
  selector: 'sky-bar-chart-series-datapoint',
  template: '',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SkyBarChartSeriesDatapointComponent {
  /**
   * The category bucket this data point belongs to (e.g. a month name or a label on the category axis).
   */
  public readonly category = input.required<SkyCategory>();

  /**
   * The human-readable label shown in tooltips for this data point (e.g. "$10,000").
   */
  public readonly labelText = input.required<string>();

  /**
   * The numeric value for this data point.
   * Accepts a single number, a floating-bar range `[min, max]`, or `null` for a gap.
   */
  public readonly value = input.required<SkyBarDatum>();

  /**
   * The data point object
   * @internal
   */
  public readonly datapoint = computed<SkyBarChartPoint>(() => {
    return {
      category: this.category(),
      label: this.labelText(),
      value: this.value(),
    };
  });
}
