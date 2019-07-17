import {
  Injectable
} from '@angular/core';

import {
  Observable
} from 'rxjs/Observable';

import 'rxjs/add/observable/throw';

import {
  SkyUIConfigService
} from '@skyux/core';

@Injectable()
export class MockSkyUIConfigService extends SkyUIConfigService {
  public getConfig(key: string, defaultConfig?: any): any {
    switch (key) {
      case 'defaultSettings':
        return Observable.of(defaultConfig);
      case 'badData':
        return Observable.of({invalidProperty: 'invalidData'});
      case 'error':
        return Observable.throw({message: 'Test error'});
      default: {
        return Observable.of({
          layout: {
            singleColumn: {
              tiles: [
                {
                  id: 'tile-1',
                  isCollapsed: true
                },
                {
                  id: 'tile-2',
                  isCollapsed: true
                }
              ]
            },
            multiColumn: [
              {
                tiles: [
                  {
                    id: 'tile-2',
                    isCollapsed: true
                  }
                ]
              },
              {
                tiles: [
                  {
                    id: 'tile-1',
                    isCollapsed: true
                  }
                ]
              }
            ]
          },
          persisted: true,
          tileIds: [
            'tile-1',
            'tile-2'
          ]
        });
      }
    }
  }

  public setConfig(key: string, value: any): Observable<any> {
    switch (key) {
      case 'badData':
        return Observable.throw({message: 'Test error'});
      default:
        return Observable.of({});
    }
  }
}
