import {
  Injectable
} from '@angular/core';

import {
  Observable,
  of as observableOf
} from 'rxjs';

@Injectable()
export class SkyUIConfigService {

  public getConfig(
    key: string,
    defaultConfig?: any
  ): Observable<any> {
    return observableOf(defaultConfig);
  }

  /* istanbul ignore next */
  public setConfig(
    key: string,
    value: any
  ): Observable<any> {
    return observableOf({});
  }
}
