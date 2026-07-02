import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  input,
} from '@angular/core';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'sky-chart-category-axis',
  template: ``,
})
export class SkyChartCategoryAxis {
  public readonly labelHidden = input(false, { transform: booleanAttribute });
  public readonly labelText = input.required<string>();
}
