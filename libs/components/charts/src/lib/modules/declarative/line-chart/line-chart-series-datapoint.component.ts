import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { SkyLineDatum } from '../../line-chart/line-chart-types';
import { SkyCategory } from '../../shared/types/category';

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
}
