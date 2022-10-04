import { AfterViewInit, Component } from '@angular/core';
import { SkyTileDashboardConfig } from '@skyux/tiles';

import { BehaviorSubject } from 'rxjs';

import { Tile1Component } from './tile1/tile1.component';
import { Tile2Component } from './tile2/tile2.component';
import { TileParameters } from './tile-parameters.token';

@Component({
  selector: 'app-tile-dashboard',
  templateUrl: './tile-dashboard.component.html',
  styleUrls: ['./tile-dashboard.component.scss'],
})
export class TileDashboardComponent implements AfterViewInit {
  public dashboardConfig: SkyTileDashboardConfig = {
    tiles: [
      {
        id: 'tile1',
        componentType: Tile1Component,
        providers: [
          {
            provide: TileParameters,
            useValue: {
              tileName: 'Tile 1',
              showInlineHelp: false,
            },
          },
        ],
      },
      {
        id: 'tile2',
        componentType: Tile2Component,
        providers: [
          {
            provide: TileParameters,
            useValue: {
              tileName: 'Tile 2',
              showInlineHelp: false,
            },
          },
        ],
      },
      {
        id: 'tile3',
        componentType: Tile1Component,
        providers: [
          {
            provide: TileParameters,
            useValue: {
              tileName: 'Tile 3',
              showInlineHelp: true,
            },
          },
        ],
      },
      {
        id: 'tile4',
        componentType: Tile2Component,
        providers: [
          {
            provide: TileParameters,
            useValue: {
              tileName: 'Tile 4',
              showInlineHelp: true,
            },
          },
        ],
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
          {
            id: 'tile4',
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
            {
              id: 'tile3',
              isCollapsed: true,
            },
            {
              id: 'tile4',
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

  public ready$ = new BehaviorSubject<boolean>(false);

  public ngAfterViewInit(): void {
    setTimeout(() => {
      this.ready$.next(true);
    });
  }
}
