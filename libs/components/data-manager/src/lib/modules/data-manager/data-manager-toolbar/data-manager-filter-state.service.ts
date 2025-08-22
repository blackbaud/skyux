import { Injectable } from '@angular/core';
import { SkyFilterState, SkyFilterStateService } from '@skyux/lists';

import { ReplaySubject, Subject } from 'rxjs';

/**
 * @internal
 */
@Injectable()
export class SkyDataManagerFilterStateService implements SkyFilterStateService {
  readonly #stateSubject = new ReplaySubject<SkyFilterState>(0);
  readonly #filterSubject = new Subject<SkyFilterState>();

  public readonly dataStateChanges = this.#stateSubject.asObservable();
  public readonly filterBarChanges = this.#filterSubject.asObservable();

  public updateDataState(value: SkyFilterState): void {
    this.#filterSubject.next(value);
  }

  public updateFilterBar(value: SkyFilterState): void {
    this.#stateSubject.next(value);
  }
}
