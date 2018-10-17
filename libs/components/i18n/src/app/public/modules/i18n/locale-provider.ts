import {
  Injectable
} from '@angular/core';

import {
  Observable
} from 'rxjs/Observable';

import {
  SkyAppLocaleInfo
} from './locale-info';

@Injectable()
export class SkyAppLocaleProvider {
  public getLocaleInfo(): Observable<SkyAppLocaleInfo> {
    return Observable.of({
      locale: 'en_US'
    });
  }
}
