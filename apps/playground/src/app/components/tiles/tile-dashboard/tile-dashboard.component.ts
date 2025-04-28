import { Component, effect, model } from '@angular/core';
import { SkyTileDashboardConfig } from '@skyux/tiles';

import { GreetingService } from './greeting/greeting.service';
import { Tile1Component } from './tile1.component';
import { Tile2Component } from './tile2.component';
import { Tile3Component } from './tile3.component';

@Component({
  selector: 'app-tile-dashboard',
  templateUrl: './tile-dashboard.component.html',
  standalone: false,
})
export class TileDashboardComponent {
  protected dashboardConfig = model<SkyTileDashboardConfig>({
    tiles: [
      {
        id: 'tile1',
        componentType: Tile1Component,
      },
      {
        id: 'tile2',
        componentType: Tile2Component,
      },
      {
        id: 'tile3',
        componentType: Tile3Component,
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
          {
            id: 'tile3',
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
            {
              id: 'tile3',
              isCollapsed: true,
            },
          ],
        },
      ],
    },
  });

  constructor(public readonly greeting: GreetingService) {
    console.log(this.greeting.sayHello());
    effect(() => {
      const config = this.dashboardConfig();
      console.log('Config changed:', config);
    });
  }
}
