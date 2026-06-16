import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { SkyDropdownModule } from '@skyux/popovers';

import { SkyChartsResourcesModule } from '../shared/sky-charts-resources.module';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SkyDropdownModule, SkyChartsResourcesModule],
  selector: 'sky-chart-controls',
  templateUrl: './chart-controls.html',
})
export class SkyChartControls {
  public readonly headingText = input.required<string>();
}
