import {
  Injectable
} from '@angular/core';

import {
  Observable
} from 'rxjs/Observable';

import {
  SkyAppLocaleInfo
} from './locale-info';

/* istanbul ignore next */
@Injectable()
export abstract class SkyAppLocaleProvider {
  public abstract getLocaleInfo(): Observable<SkyAppLocaleInfo>;
}
