import { SkyUIConfigService } from '@skyux/core';

import { Observable, of } from 'rxjs';

const SETTINGS_KEY_PREFIX = 'data-manager-test-';

export class LocalStorageConfigService extends SkyUIConfigService {
  public getConfig(key: string, defaultConfig?: any): Observable<any> {
    const settingsJSON = localStorage.getItem(`${SETTINGS_KEY_PREFIX}${key}`);
    if (settingsJSON) {
      return of(JSON.parse(settingsJSON));
    }
    return of(defaultConfig);
  }

  public setConfig(key: string, value: any): Observable<any> {
    localStorage.setItem(`${SETTINGS_KEY_PREFIX}${key}`, JSON.stringify(value));

    return of();
  }
}
