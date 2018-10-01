import {
  Component,
  ViewChild
} from '@angular/core';

import {
  SkyTileDashboardConfig
} from '../../tile-dashboard-config';
import {
  SkyTileDashboardComponent
} from '../../tile-dashboard';

import {
  Tile1TestComponent
} from './tile1.component.fixture';
import {
  Tile2TestComponent
} from './tile2.component.fixture';
import {
  TileTestContext
} from './tile-context.fixture';

@Component({
  selector: 'sky-demo-app',
  templateUrl: './tile-dashboard.component.fixture.html'
})
export class TileDashboardTestComponent {
  @ViewChild(SkyTileDashboardComponent)
  public dashboardComponent: SkyTileDashboardComponent;

  public dashboardConfig: SkyTileDashboardConfig;

  constructor() {
    this.dashboardConfig = {
      tiles: [
        {
          id: 'sky-test-tile-1',
          componentType: Tile1TestComponent
        },
        {
          id: 'sky-test-tile-2',
          componentType: Tile2TestComponent,
          providers: [
            {
              provide: TileTestContext,
              useValue: {
                id: 3
              }
            }
          ]
        },
        {
          id: 'sky-test-tile-3',
          componentType: Tile2TestComponent,
          providers: [
            {
              provide: TileTestContext,
              useValue: {
                id: 3
              }
            }
          ]
        },
        {
          id: 'sky-test-tile-4',
          componentType: Tile2TestComponent,
          providers: [
            {
              provide: TileTestContext,
              useValue: {
                id: 3
              }
            }
          ]
        }
      ],
      layout: {
        singleColumn: {
          tiles: [
            {
              id: 'sky-test-tile-2',
              isCollapsed: false
            },
            {
              id: 'sky-test-tile-1',
              isCollapsed: true
            },
            {
              id: 'sky-test-tile-3',
              isCollapsed: false
            },
            {
              id: 'sky-test-tile-4',
              isCollapsed: false
            }
          ]
        },
        multiColumn: [
          {
            tiles: [
              {
                id: 'sky-test-tile-1',
                isCollapsed: true
              },
              {
                id: 'sky-test-tile-3',
                isCollapsed: false
              },
              {
                id: 'sky-test-tile-4',
                isCollapsed: false
              }
            ]
          },
          {
            tiles: [
              {
                id: 'sky-test-tile-2',
                isCollapsed: false
              }
            ]
          }
        ]
      }
    };
  }
}
