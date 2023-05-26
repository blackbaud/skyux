import { Injectable } from '@angular/core';

import { Observable, Subject } from 'rxjs';

import { SkyLayoutHostForChildArgs } from './layout-host-for-child-args';

/**
 * @internal
 */
@Injectable()
export class SkyLayoutHostService {
  public get hostLayoutForChild(): Observable<SkyLayoutHostForChildArgs> {
    return this.#hostLayoutForChildObs;
  }

  #hostLayoutForChild = new Subject<SkyLayoutHostForChildArgs>();
  #hostLayoutForChildObs = this.#hostLayoutForChild.asObservable();

  public setHostLayoutForChild(layout: SkyLayoutHostForChildArgs): void {
    this.#hostLayoutForChild.next(layout);
  }
}
