import { AfterViewInit, Component } from '@angular/core';
import { SkyTileDashboardConfig } from '@skyux/tiles';

import { BehaviorSubject } from 'rxjs';

import { TileParameters } from './tile-parameters.token';
import { Tile1Component } from './tile1/tile1.component';
import { Tile2Component } from './tile2/tile2.component';
import { Tile3Component } from './tile3/tile3.component';

@Component({
  selector: 'app-tile-dashboard',
  templateUrl: './tile-dashboard.component.html',
  styleUrls: ['./tile-dashboard.component.scss'],
  standalone: false,
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
      {
        id: 'tile5',
        componentType: Tile3Component,
        providers: [
          {
            provide: TileParameters,
            useValue: {
              tileName: 'Tile 5',
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
          {
            id: 'tile5',
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
            {
              id: 'tile5',
              isCollapsed: true,
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
