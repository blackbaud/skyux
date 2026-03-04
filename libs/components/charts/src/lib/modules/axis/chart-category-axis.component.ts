import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from '@angular/core';

import { SkyChartCategoryAxisConfig } from '../shared/types/axis-types';

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

  /**
   * The axis object
   * @internal
   */
  public readonly axis = computed<SkyChartCategoryAxisConfig>(() => {
    return {
      label: this.labelText(),
    };
  });
}
