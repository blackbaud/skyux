import { Component } from '@angular/core';
import { SkyTileDashboardConfig, SkyTilesModule } from '@skyux/tiles';

import { Tile1Component } from './tile1.component';
import { Tile2Component } from './tile2.component';

@Component({
  standalone: true,
  selector: 'sky-tile-dashboard-fixture',
  templateUrl: './tile-dashboard-harness-test.component.html',
  imports: [SkyTilesModule],
})
export class TileDashboardHarnessTestComponent {
  protected dashboardConfig: SkyTileDashboardConfig = {
    tiles: [
      {
        id: 'tile1',
        componentType: Tile1Component,
      },
      {
        id: 'tile2',
        componentType: Tile2Component,
      },
    ],
    layout: {
      singleColumn: {
        tiles: [
          {
            id: 'tile2',
            isCollapsed: false,
          },
          {
            id: 'tile1',
            isCollapsed: true,
          },
        ],
      },
      multiColumn: [
        {
          tiles: [
            {
              id: 'tile1',
              isCollapsed: true,
            },
          ],
        },
        {
          tiles: [
            {
              id: 'tile2',
              isCollapsed: false,
            },
          ],
        },
      ],
    },
  };

  protected emptyConfig: SkyTileDashboardConfig = {
    tiles: [],
    layout: {
      singleColumn: { tiles: [] },
      multiColumn: [{ tiles: [] }, { tiles: [] }],
    },
  };
}
