import { Component, input } from '@angular/core';

@Component({
  selector: 'sky-chart-subheading',
  styleUrl: './chart-subheading.scss',
  template: `{{ subheadingText() }}`,
})
export class SkyChartSubheading {
  public readonly subheadingText = input.required<string>();
}
