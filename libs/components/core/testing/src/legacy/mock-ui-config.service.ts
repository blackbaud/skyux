import { Injectable } from '@angular/core';
import { SkyUIConfigService } from '@skyux/core';

import { Observable, of as observableOf } from 'rxjs';

/**
 * @internal
 */
@Injectable()
export class MockSkyUIConfigService extends SkyUIConfigService {
  public override getConfig(key: string, defaultConfig?: any): Observable<any> {
    switch (key) {
      case 'defaultSettings':
        return observableOf(defaultConfig);
      case 'badData':
        return observableOf({ invalidProperty: 'invalidData' });
      default: {
        return observableOf({
          settings: {
            userSettings: {
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
            defaultSettings: ['tile-1', 'tile-2'],
          },
        });
      }
    }
  }
}
