import { Component } from '@angular/core';
import { SkyTileDashboardConfig, SkyTilesModule } from '@skyux/tiles';

import { BlocksTileDashboardPageTile1Component } from './tile1.component';
import { BlocksTileDashboardPageTile2Component } from './tile2.component';

@Component({
  selector: 'app-page-layout-tile-dashboard',
  imports: [SkyTilesModule],
  template: `<sky-tile-dashboard [(config)]="dashboardConfig" />`,
})
export class PageLayoutTileDashboardComponent {
  protected dashboardConfig: SkyTileDashboardConfig = {
    tiles: [
      {
        id: 'tile1',
        componentType: BlocksTileDashboardPageTile1Component,
      },
      {
        id: 'tile2',
        componentType: BlocksTileDashboardPageTile2Component,
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
}
