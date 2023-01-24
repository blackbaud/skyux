import { Component } from '@angular/core';
import { SkyTileDashboardConfig } from '@skyux/tiles';

import { Tile1Component } from './tile1.component';

@Component({
  selector: 'app-tile-dashboard',
  templateUrl: './tile-dashboard.component.html',
})
export class TileDashboardComponent {
  public dashboardConfig: SkyTileDashboardConfig = {
    tiles: [
      {
        id: 'tile',
        componentType: Tile1Component,
      },
    ],
    layout: {
      singleColumn: {
        tiles: [
          {
            id: 'tile',
            isCollapsed: false,
          },
        ],
      },
      multiColumn: [
        {
          tiles: [
            {
              id: 'tile',
              isCollapsed: false,
            },
          ],
        },
      ],
    },
  };
}
