import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  input,
} from '@angular/core';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'sky-chart-value-axis',
  template: ``,
})
export class SkyChartValueAxis {
  public readonly labelHidden = input(false, { transform: booleanAttribute });
  public readonly labelText = input.required<string>();
}
