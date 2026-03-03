import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from '@angular/core';

import { SkyCategory } from '../shared/types/category';

import { SkyLineChartPoint, SkyLineDatum } from './line-chart-types';

/**
 * Represents a single data point within a chart series.
 */
@Component({
  selector: 'sky-line-chart-series-datapoint',
  template: '',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SkyLineChartSeriesDatapointComponent {
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
   */
  public readonly value = input.required<SkyLineDatum>();

  /**
   * The data point object
   * @internal
   */
  public readonly datapoint = computed<SkyLineChartPoint>(() => {
    return {
      category: this.category(),
      label: this.labelText(),
      value: this.value(),
    };
  });
}
