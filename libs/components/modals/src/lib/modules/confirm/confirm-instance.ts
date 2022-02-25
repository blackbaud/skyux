import { EventEmitter } from '@angular/core';

import { SkyConfirmCloseEventArgs } from './confirm-closed-event-args';

export class SkyConfirmInstance {
  /**
   * Fires when users select an action to close the confirmation dialog. This event
   * returns a `SkyConfirmCloseEventArgs` object with information about the button that
   * users select.
   */
  public closed = new EventEmitter<SkyConfirmCloseEventArgs>();
}
