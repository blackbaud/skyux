import {
  Injectable
} from '@angular/core';

import {
  Observable
} from 'rxjs/Observable';

import 'rxjs/add/observable/of';

import {
  SkyAppLocaleInfo
} from './locale-info';

@Injectable()
export class SkyAppLocaleProvider {
  public get defaultLocale(): string {
    return SkyAppLocaleProvider._defaultLocale;
  }

  private static _defaultLocale = 'en-US';

  public getLocaleInfo(): Observable<SkyAppLocaleInfo> {
    return Observable.of({
      locale: this.defaultLocale
    });
  }
}
