import {
  Injectable
} from '@angular/core';

import {
  BehaviorSubject
} from 'rxjs';

/**
 * @internal
 */
@Injectable()
export class SkySortService {
  public selectedItem: BehaviorSubject<string> = new BehaviorSubject('');

  public selectItem(sortItem: string) {
    this.selectedItem.next(sortItem);
  }
}
