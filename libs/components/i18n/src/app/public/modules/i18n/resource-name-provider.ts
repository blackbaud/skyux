import {
  Injectable
} from '@angular/core';

import {
  Observable
} from 'rxjs/Observable';

import 'rxjs/add/observable/of';

@Injectable()
export class SkyAppResourceNameProvider {

  public getResourceName(name: string): Observable<string> {
    return Observable.of(name);
  }
}
