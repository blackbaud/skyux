import { EventEmitter } from '@angular/core';

import { SkyConfirmCloseEventArgs } from './confirm-closed-event-args';

export class SkyConfirmInstance {
  /**
   * Fires when users select an action to close the dialog. This event
   * returns a `SkyConfirmCloseEventArgs` object with information about the button that
   * users select. The action `'cancel'` is returned when users press the <kbd>Escape</kbd> key.
   */
  public closed = new EventEmitter<SkyConfirmCloseEventArgs>();
}
