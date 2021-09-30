import {
  Component
} from '@angular/core';

import {
  SkyTileDashboardConfig
} from 'projects/tiles/src/public-api';

import {
  TileDemoTile1Component
} from './tile-demo-tile1.component';

import {
  TileDemoTile2Component
} from './tile-demo-tile2.component';

@Component({
  selector: 'sky-tiles-demo',
  templateUrl: './tiles-demo.component.html'
})
export class TilesDemoComponent {

  public dashboardConfig: SkyTileDashboardConfig = {
    tiles: [
      {
        id: 'tile1',
        componentType: TileDemoTile1Component
      },
      {
        id: 'tile2',
        componentType: TileDemoTile2Component
      }
    ],
    layout: {
      singleColumn: {
        tiles: [
          {
            id: 'tile2',
            isCollapsed: false
          },
          {
            id: 'tile1',
            isCollapsed: true
          }
        ]
      },
      multiColumn: [
        {
          tiles: [
            {
              id: 'tile1',
              isCollapsed: true
            }
          ]
        },
        {
          tiles: [
            {
              id: 'tile2',
              isCollapsed: false
            }
          ]
        }
      ]
    }
  };
}
