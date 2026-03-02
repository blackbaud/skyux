import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { SkyDonutDatum } from '../../donut-chart/donut-chart-types';
import { SkyCategory } from '../../shared/types/category';

/**
 * Represents a single data point within a chart series.
 */
@Component({
  selector: 'sky-donut-chart-series-datapoint',
  template: '',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SkyDonutChartSeriesDatapointComponent {
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
  public readonly value = input.required<SkyDonutDatum>();
}
