import { ChangeDetectionStrategy, Component, ViewChild } from '@angular/core';

import { SkyTileDashboardConfig } from '../../tile-dashboard-config/tile-dashboard-config';
import { SkyTileDashboardComponent } from '../../tile-dashboard/tile-dashboard.component';

import { TileAsyncTestComponent } from './tile-async.component.fixture';

@Component({
  selector: 'sky-tile-dashboard-async-test',
  template: `<sky-tile-dashboard [(config)]="dashboardConfig" />`,
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class TileDashboardAsyncTestComponent {
  @ViewChild(SkyTileDashboardComponent, {
    read: SkyTileDashboardComponent,
    static: false,
  })
  public dashboardComponent!: SkyTileDashboardComponent;

  public dashboardConfig: SkyTileDashboardConfig = {
    tiles: [
      {
        id: 'sky-test-tile-async',
        componentType: TileAsyncTestComponent,
      },
    ],
    layout: {
      singleColumn: {
        tiles: [
          {
            id: 'sky-test-tile-async',
            isCollapsed: false,
          },
        ],
      },
      multiColumn: [
        {
          tiles: [
            {
              id: 'sky-test-tile-async',
              isCollapsed: false,
            },
          ],
        },
      ],
    },
  };
}
