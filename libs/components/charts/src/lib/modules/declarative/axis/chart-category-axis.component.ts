import { ChangeDetectionStrategy, Component, input } from '@angular/core';

/**
 * Configures the chart's category axis
 */
@Component({
  selector: 'sky-chart-category-axis',
  template: '',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SkyChartCategoryAxisComponent {
  /**
   * The label displayed alongside the category axis.
   */
  public readonly labelText = input.required<string>();
}
