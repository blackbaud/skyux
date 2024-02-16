import { Observable } from 'rxjs';

import { SkyConfirmCloseEventArgs } from './confirm-closed-event-args';

export class SkyConfirmInstance {
  /**
   * Fires when users select an action to close the dialog. This event
   * returns a `SkyConfirmCloseEventArgs` object with information about the button that
   * users select. It returns the `'cancel'` action when users press the <kbd>Escape</kbd> key.
   */
  public closed: Observable<SkyConfirmCloseEventArgs>;

  constructor(closedObs?: Observable<SkyConfirmCloseEventArgs>) {
    this.closed =
      closedObs ??
      /* istanbul ignore next */ new Observable<SkyConfirmCloseEventArgs>();
  }
}
