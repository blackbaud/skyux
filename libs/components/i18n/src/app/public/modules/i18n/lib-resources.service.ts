// #region imports
import {
  Inject,
  Injectable
} from '@angular/core';

import {
  Observable
} from 'rxjs/Observable';

import {
  Format
} from '../../utils/format';

import {
  SkyAppLocaleInfo
} from './locale-info';

import {
  SkyAppLocaleProvider
} from './locale-provider';

import {
  SKY_LIB_RESOURCES_PROVIDERS
} from './lib-resources-providers-token';

import {
  SkyLibResourcesProvider
} from './lib-resources-provider';
// #endregion

@Injectable()
export class SkyLibResourcesService {
  constructor(
    private localeProvider: SkyAppLocaleProvider,
    @Inject(SKY_LIB_RESOURCES_PROVIDERS) private providers: SkyLibResourcesProvider[]
  ) { }

  public getString(name: string, ...args: any[]): Observable<string> {
    return this.localeProvider.getLocaleInfo()
      .map((info) => this.getStringForLocale(info, name, ...args));
  }

  public getStringForLocale(
    info: SkyAppLocaleInfo,
    name: string,
    ...args: any[]
  ): string {
    for (const provider of this.providers) {
      const s = provider.getString(info, name);
       if (s) {
        return Format.formatText(s, ...args);
      }
    }

    return name;
  }
}
