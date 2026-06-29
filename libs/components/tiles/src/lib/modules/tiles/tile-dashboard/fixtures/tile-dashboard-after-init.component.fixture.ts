import { Component, model } from '@angular/core';

import { SkyTileDashboardConfig } from '../../tile-dashboard-config/tile-dashboard-config';

@Component({
  selector: 'sky-demo-app',
  templateUrl: './tile-dashboard-after-init.component.fixture.html',
  standalone: false,
})
export class TileDashboardAfterInitTestComponent {
  public dashboardConfig = model<SkyTileDashboardConfig | undefined>(undefined);
}
