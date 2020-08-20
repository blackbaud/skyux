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

    return new Observable(subscriber => {
      setTimeout(() => {
        subscriber.next(JSON.parse(settingsJSON));
        subscriber.complete();
      }, 2000);
    });
  }

  public setConfig(key: string, value: any): Observable<any> {
    localStorage.setItem(`${SETTINGS_KEY_PREFIX}${key}`, JSON.stringify(value));

    return of();
  }
}
