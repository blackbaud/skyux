import {
  ChangeDetectionStrategy,
  Component,
  ViewChild
} from '@angular/core';

import {
  Subject
} from 'rxjs';

import {
  SkyTileDashboardComponent
} from '../../../tiles/tile-dashboard/tile-dashboard.component';

import {
  SkyTileDashboardConfig
} from '../../../tiles/tile-dashboard-config/tile-dashboard-config';

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
  templateUrl: './tile-dashboard.component.fixture.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TileDashboardOnPushTestComponent {
  @ViewChild(SkyTileDashboardComponent, {
    read: SkyTileDashboardComponent,
    static: false
  })
  public dashboardComponent: SkyTileDashboardComponent;

  public dashboardConfig: SkyTileDashboardConfig;

  public messageStream = new Subject();

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
            }
          ]
        },
        multiColumn: [
          {
            tiles: [
              {
                id: 'sky-test-tile-1',
                isCollapsed: true
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
