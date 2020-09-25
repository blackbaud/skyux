import {
  SkyUIConfigService
} from '@skyux/core';

import {
  Observable,
  of
} from 'rxjs';

const SETTINGS_KEY_PREFIX = 'data-manager-test-';

export class LocalStorageConfigService extends SkyUIConfigService {

  public getConfig(key: string, defaultConfig?: any): Observable<any> {
    let settingsJSON = localStorage.getItem(`${SETTINGS_KEY_PREFIX}${key}`);

    if (!settingsJSON) {
      return of(defaultConfig);
    }

    return new Observable(subscriber => {
      setTimeout(() => {
        if (settingsJSON) {
          subscriber.next(JSON.parse(settingsJSON));
        } else {
          subscriber.next(defaultConfig);
        }
        subscriber.complete();
      }, 2000);
    });
  }

  public setConfig(key: string, value: any): Observable<any> {
    localStorage.setItem(`${SETTINGS_KEY_PREFIX}${key}`, JSON.stringify(value));

    return of();
  }
}
