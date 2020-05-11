// #region imports
import {
  Inject,
  Injectable,
  Optional
} from '@angular/core';

import {
  forkJoin,
  Observable,
  of as observableOf
} from 'rxjs';

import {
  map
} from 'rxjs/operators';

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

import {
  SkyAppResourceNameProvider
} from './resource-name-provider';
// #endregion

@Injectable()
export class SkyLibResourcesService {
  constructor(
    private localeProvider: SkyAppLocaleProvider,
    @Inject(SKY_LIB_RESOURCES_PROVIDERS) private providers: SkyLibResourcesProvider[],
    @Optional() private resourceNameProvider: SkyAppResourceNameProvider
  ) { }

  public getString(name: string, ...args: any[]): Observable<string> {
    let mappedNameObs = this.resourceNameProvider ?
    this.resourceNameProvider.getResourceName(name) : observableOf(name);

    let localeInfoObs = this.localeProvider.getLocaleInfo();

    return forkJoin([mappedNameObs, localeInfoObs]).pipe(
      map(([mappedName, localeInfo]) => this.getStringForLocale(localeInfo, mappedName, ...args))
    );
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
