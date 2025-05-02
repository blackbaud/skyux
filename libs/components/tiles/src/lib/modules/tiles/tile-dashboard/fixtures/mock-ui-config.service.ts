import { Injectable } from '@angular/core';
import { SkyUIConfigService } from '@skyux/core';

import {
  Observable,
  of as observableOf,
  throwError as observableThrowError,
} from 'rxjs';

@Injectable()
export class MockSkyUIConfigService extends SkyUIConfigService {
  public override getConfig(key: string, defaultConfig?: any): any {
    switch (key) {
      case 'defaultSettings':
        return observableOf(defaultConfig);
      case 'badData':
        return observableOf({ invalidProperty: 'invalidData' });
      case 'error':
        return observableThrowError(() => ({ message: 'Test error' }));
      case 'missingLayout':
        return observableOf({
          layout: {
            singleColumn: { tiles: [] },
            multiColumn: [{ tiles: [] }, { tiles: [] }],
          },
          persisted: true,
          tileIds: [
            ...(defaultConfig?.tiles.map((tile: any) => tile.id) ?? []),
          ],
        });
      default: {
        return observableOf({
          layout: {
            singleColumn: {
              tiles: [
                {
                  id: 'tile-1',
                  isCollapsed: true,
                },
                {
                  id: 'tile-2',
                  isCollapsed: true,
                },
              ],
            },
            multiColumn: [
              {
                tiles: [
                  {
                    id: 'tile-2',
                    isCollapsed: true,
                  },
                ],
              },
              {
                tiles: [
                  {
                    id: 'tile-1',
                    isCollapsed: true,
                  },
                ],
              },
            ],
          },
          persisted: true,
          tileIds: ['tile-1', 'tile-2'],
        });
      }
    }
  }

  public override setConfig(key: string, value: any): Observable<any> {
    switch (key) {
      case 'badData':
        return observableThrowError(() => ({ message: 'Test error' }));
      default:
        return observableOf({});
    }
  }
}
