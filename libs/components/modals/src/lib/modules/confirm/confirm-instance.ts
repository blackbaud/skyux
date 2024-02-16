import { Observable, ReplaySubject } from 'rxjs';

import { SkyConfirmCloseEventArgs } from './confirm-closed-event-args';

export class SkyConfirmInstance {
  /**
   * Fires when users select an action to close the dialog. This event
   * returns a `SkyConfirmCloseEventArgs` object with information about the button that
   * users select. It returns the `'cancel'` action when users press the <kbd>Escape</kbd> key.
   */
  public get closed(): Observable<SkyConfirmCloseEventArgs> {
    return this.#closed;
  }

  readonly #closed = new ReplaySubject<SkyConfirmCloseEventArgs>();

  /**
   * Triggers the closed event with the given result.
   * @internal
   */
  public notifyClosed(result: SkyConfirmCloseEventArgs): void {
    this.#closed.next(result);
    this.#closed.complete();
  }
}
