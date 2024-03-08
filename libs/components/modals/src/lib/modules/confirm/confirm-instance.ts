import { Injectable } from '@angular/core';

import { Observable, Subject } from 'rxjs';

import { SkyConfirmCloseEventArgs } from './confirm-closed-event-args';

@Injectable()
export class SkyConfirmInstance {
  /**
   * Fires when users select an action to close the dialog. This event
   * returns a `SkyConfirmCloseEventArgs` object with information about the button that
   * users select. It returns the `'cancel'` action when users press the <kbd>Escape</kbd> key.
   */
  public get closed(): Observable<SkyConfirmCloseEventArgs> {
    return this.#closedObs;
  }

  #closed: Subject<SkyConfirmCloseEventArgs>;
  #closedObs: Observable<SkyConfirmCloseEventArgs>;

  constructor() {
    this.#closed = new Subject<SkyConfirmCloseEventArgs>();
    this.#closedObs = this.#closed.asObservable();
  }

  /**
   * Closes the confirm instance.
   * @param args Specifies an object to emit to subscribers of the `closed` event
   * of the confirm instance.
   */
  public close(args: SkyConfirmCloseEventArgs): void {
    this.#closed.next(args);
    this.#closed.complete();
  }
}
