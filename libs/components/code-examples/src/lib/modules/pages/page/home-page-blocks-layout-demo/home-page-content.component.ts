import { Component } from '@angular/core';
import { SkyTileDashboardConfig, SkyTilesModule } from '@skyux/tiles';

import { TileMyActionsComponent } from './tile-my-actions.component';
import { TileUpdatesComponent } from './tile-updates.component';

@Component({
  selector: 'app-home-page-content',
  templateUrl: './home-page-content.component.html',
  imports: [SkyTilesModule],
})
export class HomePageContentComponent {
  protected dashboardConfig: SkyTileDashboardConfig = {
    tiles: [
      {
        id: 'tile-updates',
        componentType: TileUpdatesComponent,
      },
      {
        id: 'tile-my-actions',
        componentType: TileMyActionsComponent,
      },
    ],
    layout: {
      singleColumn: {
        tiles: [
          {
            id: 'tile-updates',
            isCollapsed: false,
          },
          {
            id: 'tile-my-actions',
            isCollapsed: false,
          },
        ],
      },
      multiColumn: [
        {
          tiles: [
            {
              id: 'tile-updates',
              isCollapsed: false,
            },
          ],
        },
        {
          tiles: [
            {
              id: 'tile-my-actions',
              isCollapsed: false,
            },
          ],
        },
      ],
    },
  };
}
