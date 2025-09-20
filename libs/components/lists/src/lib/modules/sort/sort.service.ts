import { Injectable } from '@angular/core';

import { BehaviorSubject } from 'rxjs';

/**
 * @internal
 */
@Injectable()
export class SkySortService {
  public selectedItem = new BehaviorSubject<string>('');

  public selectItem(sortItem: string): void {
    this.selectedItem.next(sortItem);
  }
}
