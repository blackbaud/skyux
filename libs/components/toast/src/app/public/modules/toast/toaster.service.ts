import {
  Injectable
} from '@angular/core';

import {
  BehaviorSubject
} from 'rxjs';

@Injectable()
export class SkyToasterService {

  public focusIn = new BehaviorSubject<boolean>(false);

  public mouseOver = new BehaviorSubject<boolean>(false);

}
