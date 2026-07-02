import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'sky-chart-series',
  template: ``,
})
export class SkyChartSeries {
  public readonly labelText = input.required<string>();
}
