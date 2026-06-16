import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { SkyI18nModule } from '@skyux/i18n';

import { SkyDropdownModule } from '@skyux/popovers';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SkyDropdownModule, SkyI18nModule],
  selector: 'sky-chart-controls',
  templateUrl: './chart-controls.html',
})
export class SkyChartControls {
  public readonly headingText = input.required<string>();
}
